<?php
add_filter( 'meta_field_block_get_block_content', function ( $content, $attributes, $block, $post_id, $object_type ) {

    $type = $attributes['fieldSettings']['type'] ?? '';
    
    if( $type !== 'date_picker' && $type !== 'date_time_picker' ) {
        return $content;
    }

    $dateTimeFormat = $attributes['dateFormat'] ?? 'd.m.Y';

    $date = $content;
    $date = new DateTime( $date );

    // Check if there are any \n characters in the date format. If so break apart the date format at the \n character, format the date with each format, and concatenate the formatted date strings together using <br>
    if( strpos( $dateTimeFormat, '\n' ) !== false ) {
        $dateFormats = explode( '\n', $dateTimeFormat );
        $formattedDates = array_map( function( $format ) use ( $date ) {
            return $date->format( $format );
        }, $dateFormats );
        $content = implode( '<br>', $formattedDates );
    } else {
        $content = $date->format( $dateTimeFormat );
    }

    return $content;
}, 10, 5);