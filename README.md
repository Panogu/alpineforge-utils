=== Measured Shape ===
Contributors: [AlpineForge GmbH (Adrian Pandjaitan)](https://alpineforge.ch)
Tags: block, gutenberg, editor
Tested up to: 6.1
Stable tag: 0.0.1
License: MIT
License URI: https://opensource.org/licenses/MIT

Utilities for the WordPress Gutenberg Editor

== Description ==

AlpineForge Utils is a WordPress plugin designed to introduce helpful missing features to the Gutenberg page editor.

== Installation ==

1. Download the Zip file from GitHub and upload it to the `/wp-content/plugins/alpineforge-utils` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress

== Frequently Asked Questions ==

= Why does the hyperlink not appear on my group block =

If the group block on which the hyperlink is applied contains a link itself (i.e., a "href"), the group block will not be wrapped in the link to prevent display errors.

== Features ==

= Group Hyperlink =

This new setting on the core/group block allows you to wrap it with a custom hyperlink. Alternatively it allows you to link directly to the current context's post (e.g., the current post in a query loop). It furthermore gives you the option to specify an anchor after the permalink to go directly to a certain section.

= Smaller Page Title =

The font-size of the page title has been decreased to reduce distraction and make the editor look more similar to the rendered end result.

== Planned ==

-   [ ] Permalink on core/button
-   [ ] Activation/deactivation of single features of this plugin
-   [ ] Query loop post selection

== Changelog ==

= 0.0.1 =

-   Initial release - Hyperlink for core/group block, Smaller Page Title

== Word of Caution ==

Please do keep in mind that this plugin is under very heavy active development and in a very early release stage. Thus, breaking changes can occur at any time between two versions.
