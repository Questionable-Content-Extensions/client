// Storybook auto-generates an "implicit action" for any arg whose name
// matches parameters.actions.argTypesRegex (see .storybook/preview.tsx:
// '^on[A-Z].*') and has no explicit value. Calling one of those during
// render/an effect throws (or in older Storybook, warns) an
// ImplicitActionsDuringRendering error in the real Storybook preview.
//
// That check only fires inside Storybook's full preview runtime
// (`__STORYBOOK_PREVIEW__`, used by `storybook dev`/build), which
// `@storybook/addon-vitest`'s headless test harness never instantiates —
// so `./run_storybook_tests.sh` silently passes stories that would break
// the moment someone opens them in a browser. This rule catches the gap
// at lint time instead, since neither test runner sees it.
const CALLBACK_NAME = /^on[A-Z]/

function isFunctionLike(type, checker) {
    return type.getCallSignatures().length > 0
}

function getObjectExpression(node, scope) {
    if (!node) return undefined
    if (node.type === 'ObjectExpression') return node
    if (node.type === 'Identifier') {
        const variable = findVariable(scope, node.name)
        const def = variable?.defs.find((d) => d.node.type === 'VariableDeclarator')
        const init = def?.node.init
        return init?.type === 'ObjectExpression' ? init : undefined
    }
    return undefined
}

function findVariable(scope, name) {
    for (let s = scope; s; s = s.upper) {
        const variable = s.variables.find((v) => v.name === name)
        if (variable) return variable
    }
    return undefined
}

function getProperty(objectExpression, key) {
    return objectExpression?.properties.find(
        (p) =>
            p.type === 'Property' &&
            ((p.key.type === 'Identifier' && p.key.name === key) ||
                (p.key.type === 'Literal' && p.key.value === key))
    )
}

function hasSpread(objectExpression) {
    return (
        objectExpression?.properties.some((p) => p.type === 'SpreadElement') ??
        false
    )
}

function explicitlyCoversProp(objectExpression, propName) {
    if (!objectExpression) return false
    if (hasSpread(objectExpression)) return true
    return !!getProperty(objectExpression, propName)
}

const rule = {
    meta: {
        type: 'problem',
        docs: {
            description:
                'Require an explicit mock for every callback prop matched by Storybook\'s implicit-actions regex, since neither test runner catches a missing one.',
        },
        schema: [],
        messages: {
            missingExplicitArg:
                'Callback prop "{{propName}}" on component "{{componentName}}" has no explicit arg in this story. ' +
                'Storybook auto-generates an "implicit action" for it, which throws if invoked during render/an effect in the real Storybook preview — ' +
                'this is invisible to ./run_storybook_tests.sh since it never instantiates the preview runtime that check depends on. ' +
                'Add an explicit mock, e.g. `import { fn } from \'storybook/test\'` and set it in `args: { {{propName}}: fn() }`.',
        },
    },
    create(context) {
        const filename = context.filename ?? context.getFilename()
        if (!/\.stories\.[tj]sx?$/.test(filename)) return {}

        const services = context.sourceCode?.parserServices ?? context.parserServices
        if (!services?.program || !services.esTreeNodeToTSNodeMap) return {}
        const checker = services.program.getTypeChecker()

        return {
            ExportDefaultDeclaration(node) {
                const scope = context.sourceCode.getScope(node)
                const metaObject = getObjectExpression(node.declaration, scope)
                if (!metaObject) return

                const componentProp = getProperty(metaObject, 'component')
                if (!componentProp) return
                const componentNode = componentProp.value

                const tsNode = services.esTreeNodeToTSNodeMap.get(componentNode)
                const componentType = checker.getTypeAtLocation(tsNode)
                const callSignatures = componentType.getCallSignatures()
                if (callSignatures.length === 0) return
                const propsParam = callSignatures[0].getParameters()[0]
                if (!propsParam) return
                const propsType = checker.getTypeOfSymbol(propsParam)

                const callbackProps = propsType
                    .getProperties()
                    .filter((sym) => CALLBACK_NAME.test(sym.getName()))
                    .filter((sym) =>
                        isFunctionLike(
                            checker.getTypeOfSymbol(sym).getNonNullableType(),
                            checker
                        )
                    )
                if (callbackProps.length === 0) return

                const componentName =
                    componentNode.type === 'Identifier'
                        ? componentNode.name
                        : 'the story component'

                const metaArgsProp = getProperty(metaObject, 'args')
                const metaArgs = getObjectExpression(metaArgsProp?.value, scope)

                // Every other `export const Foo: Story = { args: {...} }` in
                // this file — a prop not set at the meta level is only "safe"
                // if every single story that could render sets it itself.
                const storyArgsObjects = []
                const program = node.parent
                for (const statement of program.body) {
                    if (
                        statement.type !== 'ExportNamedDeclaration' ||
                        statement.declaration?.type !== 'VariableDeclaration'
                    )
                        continue
                    for (const decl of statement.declaration.declarations) {
                        if (decl.init?.type !== 'ObjectExpression') continue
                        const argsProp = getProperty(decl.init, 'args')
                        storyArgsObjects.push(
                            argsProp ? getObjectExpression(argsProp.value, scope) : undefined
                        )
                    }
                }

                for (const sym of callbackProps) {
                    const propName = sym.getName()
                    if (explicitlyCoversProp(metaArgs, propName)) continue

                    const coveredByEveryStory =
                        storyArgsObjects.length > 0 &&
                        storyArgsObjects.every((storyArgs) =>
                            explicitlyCoversProp(storyArgs, propName)
                        )
                    if (coveredByEveryStory) continue

                    context.report({
                        node: metaArgsProp ?? componentProp,
                        messageId: 'missingExplicitArg',
                        data: { propName, componentName },
                    })
                }
            },
        }
    },
}

export default {
    rules: {
        'no-implicit-story-actions': rule,
    },
}
