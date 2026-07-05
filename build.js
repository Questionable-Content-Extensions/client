const execSync = require('child_process').execSync
const fs = require('fs')

const {
    licenseBanner,
    userscriptHeader,
    userscriptHeaderVariables,
} = require('./buildValues')

// Assemble the userscript header
function assembleHeaderFor(type) {
    let assembledUserscriptHeader = userscriptHeader
    return assembledUserscriptHeader.replace(
        /<%=((?:\w|-|_)+)%>/g,
        (match, p1, offset, string) => {
            if (p1 in userscriptHeaderVariables[type]) {
                return userscriptHeaderVariables[type][p1]
            } else if (p1 in userscriptHeaderVariables) {
                return userscriptHeaderVariables[p1]
            } else {
                throw `No variable '${p1}' for '${type}' in userscript header`
            }
        }
    )
}
let developmentUserscriptHeader = assembleHeaderFor('development')
let productionUserscriptHeader = assembleHeaderFor('production')

function onStreamError(err) {
    console.error(err)
    process.exit(1)
}

// Run the Vite build script
const extraArgs = process.argv[2] || ''
execSync('npm run vite-build -- ' + extraArgs, { stdio: [0, 1, 2] })

// If it doesn't exist, create the `/dist` directory
if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist')
}

// Open the dist file for writing
let w = fs.createWriteStream('./dist/qc-ext.user.js', {
    flags: 'w',
})
w.on('error', onStreamError)

const Readable = require('stream').Readable
let s = new Readable()
s._read = () => {}
s.on('error', onStreamError)
s.push(licenseBanner)
s.push('\n')
s.push(productionUserscriptHeader)
s.push('\n')
s.push(null)

s.pipe(w, { end: false })
s.on('end', () => {
    let mr = fs.createReadStream('./build/static/js/main.js')
    mr.on('error', onStreamError)
    mr.pipe(w)
    mr.on('end', () => {
        // Open the dev file for writing
        let w = fs.createWriteStream('./dist/qc-ext-dev.user.js', {
            flags: 'w',
        })
        w.on('error', onStreamError)

        let s = new Readable()
        s._read = () => {}
        s.on('error', onStreamError)
        s.push(licenseBanner)
        s.push('\n')
        s.push(developmentUserscriptHeader)
        s.push('\n')
        s.push(null)

        s.pipe(w, { end: false })
        s.on('end', () => {
            let mr = fs.createReadStream('./build/static/js/main.js')
            mr.on('error', onStreamError)
            mr.pipe(w)
            mr.on('end', () => {
                // Open the meta file for writing
                let w = fs.createWriteStream('./dist/qc-ext.meta.js', {
                    flags: 'w',
                })
                w.on('error', onStreamError)

                let s = new Readable()
                s._read = () => {}
                s.on('error', onStreamError)
                s.push(licenseBanner)
                s.push('\n')
                s.push(productionUserscriptHeader)
                s.push('\n')
                s.push(null)

                s.pipe(w)
            })
        })
    })
})
