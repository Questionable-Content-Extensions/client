declare module 'csstype' {
    // Add the QC-EXT CSS variables to the CSS property list
    interface Properties {
        '--qc-ext-navelement-bg-color'?: Property.BackgroundColor
        '--qc-ext-navelement-color'?: Property.BackgroundColor
        '--qc-ext-navelement-accent-color'?: Property.BackgroundColor
    }
}
