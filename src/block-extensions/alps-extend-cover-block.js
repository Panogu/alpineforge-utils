/**
 * @abstract Extension for Gutenberg to add a second <img> to a core WordPress cover block to blur the background on ultrawide monitors.
 *
 * @author: apandjaitan, AlpineForge GmbH (2025)
 * @license: GPL-2.0-or-later
 * 
 * @package alps-utils
 */

// https://developer.wordpress.org/news/2024/08/how-to-extend-a-wordpress-block/
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import { ExternalLink, PanelBody, PanelRow, ToggleControl } from '@wordpress/components';

import { Children, cloneElement, isValidElement } from '@wordpress/element';    // Modify the saved markup

/**
 * Add the block attributes
 * @param {*} settings 
 * @param {*} name 
 * @returns 
 */
function addBlurOnUltrawideAttribute( settings, name ) {

	// Only add the attribute to Image blocks.
	if ( name === 'core/cover' ) {
		settings.attributes = {
			...settings.attributes,
			blurOnUltrawide: {
				type: 'boolean',
				default: false,
			},
		};
	}

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'alps-utils/add-cover-blur-on-ultrawide-attribute',
	addBlurOnUltrawideAttribute
);

/**
 * Extend the InspectorControls to add a toggle for the new attribute
 * @param {*} BlockEdit The original BlockEdit
 * @returns 
 */
function addCoverInspectorControls( BlockEdit ) {
	return ( props ) => {
		const { name, attributes, setAttributes } = props;

		// Early return if the block is not the Image block.
		if ( name !== 'core/cover' ) {
			return <BlockEdit { ...props } />;
		}

		// Retrieve selected attributes from the block.
		const { blurOnUltrawide } = attributes;

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
                <PanelBody
                    title={ __(
                        'Ultrawide Monitors',
                        'alps-utils'
                    ) }
                >
                    <PanelRow>
                        <ToggleControl
                            label={ __(
                                'Blur Background on Ultrawide',
                                'alps-utils'
                            ) }
                            checked={ blurOnUltrawide }
                            onChange={ (value) => {
                                setAttributes( {
                                    blurOnUltrawide: value,
                                } );
                            } }
                            help={ "Show the image with a blurred background on ultrawide monitors" }
                        />
                    </PanelRow>
                </PanelBody>
				</InspectorControls>
			</>
		);
	};
}

addFilter(
	'editor.BlockEdit',
	'alps-utils/add-cover-inspector-controls',
	addCoverInspectorControls
);

/**
 * Modify the saved markup to add a blurred background <img> to the cover block
 * @param {*} element The original element
 * @param {*} blockType The block type with name and properties
 * @param {*} attributes The block attributes
 * @returns 
 */
function addBlurredBackgroundToCover( element, blockType, attributes ) {
    const { name } = blockType;
    const { blurOnUltrawide } = attributes;
    const elementChildren = element?.props?.children;

    // TODO: Also either clone or just modify the <span> element which contains the overlay color, so that it is applied to the original image still in the correct size - it needs to have the max width and auto margins applied

    // Only apply the effect if the attribute is enabled and the block is a cover block
    if ( name !== 'core/cover' || !blurOnUltrawide || !elementChildren ) {
        return element;
    }

    // Helper function to find the image element (in a cover there is only one image element (without the blurred-uw class), if any)
    const findImageElement = ( children ) => {
        let imgElement = null;
        Children.forEach( children, ( child ) => {
            if ( isValidElement( child ) && child.type === 'img' && !child.props.className?.includes( 'blurred-uw' ) ) {
                imgElement = child;
            }
        } );
        return imgElement;
    };

    const imgElement = findImageElement( elementChildren );

    if ( !imgElement ) {
        return element;
    }

    // Clone the image element with the blur effect
    const blurredImage = cloneElement( imgElement, {
        // TODO: No styles should be applied directly to the element, use the blurred-uw class instead
        style: {
            position: 'absolute',
            filter: 'blur(25px)',
            transform: 'scale(1.1)',
            transformOrigin: 'center',
            width: '100%',
            zIndex: -1,
        },
        'aria-hidden': 'true',
        'role': 'presentation',
        className: 'blurred-uw',
    } );

    // Map the children so that on the original image a 1707px max-width and auto left and right margins are applied
    const mappedChildren = Children.map( elementChildren, ( child ) => {
        if ( isValidElement( child ) && child.type === 'img' && !child.props.className?.includes( 'blurred-uw' ) ) {
            return cloneElement( child, {
                // TODO: No styles should be applied directly to the element, use the original-uw class instead
                // TODO: The max-width should be set in the global styles
                style: {
                    maxWidth: '1707px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                },
                className: 'original-uw',
            } );
        }
        return child;
    } );

    // Wrap the existing element with the blurred image
    return cloneElement( element, {
        children: [ blurredImage, ...mappedChildren ],
    } );
}

addFilter(
    'blocks.getSaveElement',
    'alps-utils/add-blurred-background-to-cover',
    addBlurredBackgroundToCover
);