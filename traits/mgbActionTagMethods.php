<?php
/***
███╗   ███╗ ██████╗ ██████╗     ██████╗ ███████╗██████╗  ██████╗ █████╗ ██████╗     ████████╗███████╗ █████╗ ███╗   ███╗
████╗ ████║██╔════╝ ██╔══██╗    ██╔══██╗██╔════╝██╔══██╗██╔════╝██╔══██╗██╔══██╗    ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║
██╔████╔██║██║  ███╗██████╔╝    ██████╔╝█████╗  ██║  ██║██║     ███████║██████╔╝       ██║   █████╗  ███████║██╔████╔██║
██║╚██╔╝██║██║   ██║██╔══██╗    ██╔══██╗██╔══╝  ██║  ██║██║     ██╔══██║██╔═══╝        ██║   ██╔══╝  ██╔══██║██║╚██╔╝██║
██║ ╚═╝ ██║╚██████╔╝██████╔╝    ██║  ██║███████╗██████╔╝╚██████╗██║  ██║██║            ██║   ███████╗██║  ██║██║ ╚═╝ ██║
╚═╝     ╚═╝ ╚═════╝ ╚═════╝     ╚═╝  ╚═╝╚══════╝╚═════╝  ╚═════╝╚═╝  ╚═╝╚═╝            ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝
Description: set of methods for working with a custom Action Tag.
Usage: See corresponding MD-file (README_ActionTagMethods.md)
Version: 1.0.0
 */

namespace MGB\flexField;


trait mgbActionTagMethods
{
    function init_tags($instrument,$Proj) {
        $regexAllCaps = "/^([[:alpha:]])*$/";
        $regexAllCapsAndDash = "/\b([A-Z]+(?:-[A-Z]+)+)\b/";
        // This is an array of found functions as keys and arrays of matching fields as values
        // 'function' => 'parameters'
        static $tag_functions = array();

        // If already initialized, return $tag_functions array
//        print "Is tag function empty?\n";
        if (!empty($tag_functions)) return $tag_functions;
//        print "No - continue\n";
        // Scan through instruments rendered by this page searching for @terms
        foreach ($Proj->metadata as $k => $element) {
            if($element['form_name'] == $instrument && strpos($element['misc'],'@HIDDEN') == FALSE){
//                print "Form is : $instrument --- and field is not hidden.\n";
                $search = $element['misc'];
                // Use a strpos search initially as it is faster than regex search
                if (strpos($search,'@') !== false) {
                    // We have a potential match - lets get all terms (separated by spaces)
                    preg_match_all('/@\S+/', $search, $matches);
                    if ($matches) {
                        // We have found matches - let's parse them
                        $matches = reset($matches);
                        foreach ($matches as $match) {
                            // Some terms have a name=params format, if so, break out params (hook_details)
                            list($tag_name,$hook_details) = explode('=',$match);
                            // Allow only uppercase alpha characters in base action tag as
                            // simple security check.  Could allow alnum if needed
//                            var_dump($hook_details);
//                            var_dump($tag_name);
                            $tag_array = explode('@',$tag_name);
                            $base_tag = $tag_array[1];
                            if (preg_match($regexAllCapsAndDash, $base_tag)) {
                                $tag_functions[$tag_name] = array_merge(
                                    isset($tag_functions[$tag_name]) ? $tag_functions[$tag_name] : array(),
                                    array($element['field_name'] => array(
                                        'elements_index' => $k,
                                        'params' => $hook_details)
                                    )
                                );
                            }
                        }
                    }
                }
            }
        }
        return $tag_functions;
    }

    function getFieldsWithThisActionTag($actionTagName, $instrument, $Proj){
        $allActionTagfields =  self::init_tags($instrument, $Proj);
        $actionTagField = $allActionTagfields[$actionTagName];
        return $actionTagField;
    }

//------
// The following method works, but it generates too many warnings and errors on the server log.
// I'll leave this for reference just in case it improves in a future REDCap version (v14+).
//    function getFieldsWithThisActionTag($thisActionTag){
//        global $Proj;
//        foreach ($Proj->metadata as $fldName => $fldAttr) {
//            if(is_null($fldAttr['misc'])){
//                continue;
//            } else {
//                if (str_contains($fldAttr['misc'],$thisActionTag)) {
//                    $altLabel = \Form::getValueInQuotesActionTag($Proj->metadata[$fldName]['misc'], $thisActionTag);
//                    var_dump($altLabel);
//                }
//            }
//        }
//    }
//------
}
