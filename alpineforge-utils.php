<?php
/**
 * Plugin Name:       AlpineForge Utilities
 * Plugin URI:        https://alpineforge.ch
 * Description:       Utilities for AlpineForge Products.
 * Version:           0.0.4
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Author:            AlpineForge GmbH (Adrian Pandjaitan)
 * Author URI:        https://alpineforge.ch
 * License:           MIT
 * License URI:       https://opensource.org/licenses/MIT
 * Text Domain:       alpineforge-utils
 * Domain Path:       alps-lang
 *
 *
 *
 * GitHub Plugin URI: Panogu/alpineforge-utils
 * GitHub Plugin URI: https://github.com/Panogu/alpineforge-utils
 * Primary Branch: main
 *
 * @package           alps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function alps_utils_blocks_init() {
	// Register all blocks in the build/blocks folder
    $blocks = glob( __DIR__ . '/build/blocks/*', GLOB_ONLYDIR );
    foreach ( $blocks as $block ) {
        $block_name = basename( $block );
        register_block_type( __DIR__ . '/build/blocks/' . $block_name );

        // Register block styles
        wp_enqueue_style(
            'alps-' . $block_name . '-style',
            plugins_url( 'build/blocks/' . $block_name . '/style.css-index', __FILE__ ),
            array(),
            filemtime( plugin_dir_path( __FILE__ ) . 'build/blocks/' . $block_name . '/style-index.css' )
        );

    }
}
add_action( 'init', 'alps_utils_blocks_init' );

/**
 * Site titles should not appear large in the editor.
 */
function alps_utils_editor_styles() {
    wp_enqueue_style(
        'alps-utils-editor-styles',
        plugins_url( 'assets/css/editor-utils.css', __FILE__ ),
        array(),
        filemtime( plugin_dir_path( __FILE__ ) . 'assets/css/editor-utils.css' )
    );
}
add_action( 'enqueue_block_assets', 'alps_utils_editor_styles' );

/**
 * Append all js block/editor extensions
 */
function alps_utils_extensions_init() {
    wp_enqueue_script(
        'alps-blocks-extension',
        plugins_url( 'build/index.js', __FILE__ ),
        array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n' ),
        filemtime( plugin_dir_path( __FILE__ ) . 'build/index.js' )
    );
}
add_action( 'init', 'alps_utils_extensions_init' );

/**
 * General link function
 */
function alps_utils_wrap_with_link( $block_content, $block ) {
    
    $link_enabled = $block['attrs']['alpsLinkEnabled'] ?? false;
    if($link_enabled && $block['blockName'] === 'core/group') {

        // Check if the block has a hyperlink specified in its content
        if( strpos($block_content, 'href') !== false ) {
            return $block_content;
        }

        $hyperlink = $block['attrs']['alpsUrl']['url'] ?? "";
        // Get the correct hyperlink (i.e., either the link from the block attributes if it is specified or the current post URL)
        if ( $block['attrs']['alpsLinkToPost'] ?? false ) {
            $hyperlink = get_permalink() . ($block['attrs']['alpsAnchorLink'] ?? "");
        }

        $target = $block['attrs']['alpsOpensInNewTab'] ?? false ? "_blank" : "_self";
        $nofollow = $block['attrs']['alpsNofollow'] ?? false ? "rel='nofollow'" : "";

        $wrapper = "<a class='alps__link-wrapper' href='$hyperlink' target='$target' $nofollow>";
        $wrapper .= $block_content;
        $wrapper .= '</a>';
        return $wrapper;
    }

    return $block_content;
}
add_filter( 'render_block_core/group', 'alps_utils_wrap_with_link', 10, 2 );

/**
 * Include all core-extensions (for WordPress PHP) from the core-extensions folder
 */
// Meta Field Block Extensions
$extensions = glob( __DIR__ . '/core-extensions/meta-fields/*.php' );
foreach ( $extensions as $extension ) {
    
    require_once $extension;
}

// Support Extensions
$extensions = glob( __DIR__ . '/core-extensions/block-supports/*.php' );
foreach ( $extensions as $extension ) {
    
    require_once $extension;
}

// Enqueue the alps-ghub-query-slider-frontent.js script in the frontend
function alps_utils_enqueue_frontend_scripts() {
    wp_enqueue_script(
        'alps-ghub-query-slider-frontend',
        plugins_url( 'assets/js/alps-ghub-query-slider-frontend.js', __FILE__ ),
        array( 'jquery' ),
        filemtime( plugin_dir_path( __FILE__ ) . 'assets/js/alps-ghub-query-slider-frontend.js' ),
        true
    );
}

add_action( 'wp_enqueue_scripts', 'alps_utils_enqueue_frontend_scripts' );