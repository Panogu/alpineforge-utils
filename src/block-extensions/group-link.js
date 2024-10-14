import { registerBlockExtension } from '@10up/block-components';
import {
	InspectorControls,
	__experimentalLinkControl as LinkControl,
} from '@wordpress/block-editor';
import {
	Icon,
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

/**
 * BlockEdit
 *
 * Extends the InspectorControls for the Group block to add a link control.
 *
 * @param {object} props block props
 * @returns {JSX}
 */
function BlockEdit(props) {
	const {
		alpsLinkEnabled,
		alpsUrl,
		alpsOpensInNewTab,
		alpsNofollow,
		alpsLinkToPost,
		alpsAnchorLink,
	} = props.attributes;

	return (
		<InspectorControls>
			<PanelBody title="Hyperlink">
				<PanelRow>
					<div className="alps__group-link-control">
						<ToggleControl
							label="Enable hyperlink"
							checked={alpsLinkEnabled}
							onChange={(value) =>
								props.setAttributes({ alpsLinkEnabled: value })
							}
						/>
						{alpsLinkEnabled && (
							<>
								<ToggleControl
									label="Link to current post"
									checked={alpsLinkToPost}
									onChange={(value) =>
										props.setAttributes({
											alpsLinkToPost: value,
										})
									}
								/>
								<div className="alps__group-link-control__content-input">
									{!alpsLinkToPost && (
										<LinkControl
											value={alpsUrl}
											onChange={(value) =>
												props.setAttributes({
													alpsUrl: value,
												})
											}
										/>
									)}
									{alpsLinkToPost && (
										<TextControl
											placeholder="#anchor"
											value={alpsAnchorLink}
											onChange={(value) =>
												props.setAttributes({
													alpsAnchorLink: value,
												})
											}
										/>
									)}
									{((alpsUrl && !alpsLinkToPost) ||
										(alpsAnchorLink && alpsLinkToPost)) && (
										<Icon
											icon="editor-unlink"
											className="alps__group-link-control__content-input__unlink-icon"
											onClick={() => {
												if (alpsLinkToPost) {
													props.setAttributes({
														alpsAnchorLink: '',
													});
												} else {
													props.setAttributes({
														alpsUrl: {},
													});
												}
											}}
										/>
									)}
								</div>
								<ToggleControl
									label="Open in new tab"
									checked={alpsOpensInNewTab}
									onChange={(value) =>
										props.setAttributes({
											alpsOpensInNewTab: value,
										})
									}
								/>
								<ToggleControl
									label="Add nofollow"
									checked={alpsNofollow}
									onChange={(value) =>
										props.setAttributes({
											alpsNofollow: value,
										})
									}
								/>
							</>
						)}
					</div>
				</PanelRow>
			</PanelBody>
		</InspectorControls>
	);
}

/**
 * generateClassNames
 *
 * a function to generate the new className string that should
 * get added to the wrapping element of the block.
 *
 * used for the 10up block components classNameGenerator prop
 *
 * @param {object} attributes block attributes
 * @returns {string}
 */
function generateClassNames(attributes) {
	return '';
}

registerBlockExtension('core/group', {
	extensionName: 'group-link',
	attributes: {
		alpsLinkEnabled: {
			type: 'boolean',
			default: false,
		},
		alpsUrl: {
			type: 'object',
			default: {},
		},
		alpsAnchorLink: {
			type: 'string',
			default: '',
		},
		alpsOpensInNewTab: {
			type: 'boolean',
			default: false,
		},
		alpsNofollow: {
			type: 'boolean',
			default: false,
		},
		alpsLinkToPost: {
			type: 'boolean',
			default: false,
		},
	},
	classNameGenerator: generateClassNames,
	Edit: BlockEdit,
});
