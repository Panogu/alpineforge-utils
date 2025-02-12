<?php
function my_admin_only_render_field_settings( $field ) {
    acf_render_field_setting( $field, array(
        'label'        => __( 'Date as d.M', 'my-textdomain' ),
        'instructions' => '',
        'name'         => 'alps_date_title_format',
        'type'         => 'true_false',
        'ui'           => 1,
    ), true ); // If adding a setting globally, you MUST pass true as the third parameter!
}
add_action( 'acf/render_field_settings', 'my_admin_only_render_field_settings' );

add_filter( 'meta_field_block_get_acf_field', function ( $field_value, $object_id, $field, $raw_value, $object_type ) {

    if ( empty( $field['alps_date_title_format'] ) ) {
        return $field_value;
    }

    $field_name = $field['name'] ?? '';
  
    // Replace your_field_name with your unique name.
    if ( 1 === $field['alps_date_title_format'] ) {
        // Do whatever you want here.
        $field_value = "1.<br/>Jan";
    }
  
    return $field_value;
}, 10, 5);