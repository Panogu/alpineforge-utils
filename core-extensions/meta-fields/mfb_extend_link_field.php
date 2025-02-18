<?php
function alps_mfb_register_file_settings( $field ) {
    acf_render_field_setting( $field, array(
        'label'        => __( 'Display as button in Gutenberg', 'alps-utils' ),
        'instructions' => '',
        'name'         => 'alps_display_as_button',
        'type'         => 'true_false',
        'ui'           => 1,
    ), true ); // If adding a setting globally, you MUST pass true as the third parameter!
}
add_action( 'acf/render_field_settings', 'alps_mfb_register_file_settings' );

add_filter( 'meta_field_block_get_acf_field', function ( $field_value, $object_id, $field, $raw_value, $object_type ) {

    if ( empty( $field['alps_display_as_button'] ) ) {
        return $field_value;
    }

    $field_name = $field['name'] ?? '';
  
    // Replace your_field_name with your unique name.
    if ( 1 === $field['alps_display_as_button'] ) {
        
        $field_value = '<a href="' . $field_value . '" target="_blank" class="button button-primary">Download</a>';

    }
  
    return $field_value;
}, 10, 5);