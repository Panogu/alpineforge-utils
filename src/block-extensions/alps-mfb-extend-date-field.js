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
import { ExternalLink, PanelBody, PanelRow, TextControl, ToggleControl } from '@wordpress/components';

import { Children, cloneElement, isValidElement } from '@wordpress/element';    // Modify the saved markup

/**
 * Add the block attributes
 * @param {*} settings 
 * @param {*} name 
 * @returns 
 */
function addDateFormattingAttribute( settings, name ) {

	// Only add the attribute to Image blocks.
	if ( name === 'mfb/meta-field-block' ) {
		settings.attributes = {
			...settings.attributes,
			dateFormat: {
				type: 'string',
				default: "d.m.Y",
			},
		};
	}

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'alps-utils/add-date-formatting-attribute',
	addDateFormattingAttribute
);

/**
 * Extend the InspectorControls to add a toggle for the new attribute
 * @param {*} BlockEdit The original BlockEdit
 * @returns 
 */
function addAlpsMfbInspectorControls( BlockEdit ) {
	return ( props ) => {
		const { name, attributes, setAttributes } = props;

		// Early return if the block is not the Image block.
		if ( name !== 'mfb/meta-field-block' ) {
			return <BlockEdit { ...props } />;
		}

		// Retrieve selected attributes from the block.
		const { dateFormat } = attributes;

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
                <PanelBody
                    title={ __(
                        'Date Formatting',
                        'alps-utils'
                    ) }
                >
                    <PanelRow>
                        <TextControl
                            label={ __(
                                'PHP Date Format',
                                'alps-utils'
                            ) }
                            value={ dateFormat }
                            onChange={ (value) => {
                                setAttributes( {
                                    dateFormat: value,
                                } );
                            } }
                            help={ "Output the date in a certain format" }
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
	'alps-utils/add-alps-mfb-inspector-controls',
	addAlpsMfbInspectorControls
);