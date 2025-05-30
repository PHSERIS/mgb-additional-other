$(document).ready(function() {

    console.log("Getting Value from element: " + $('#makeAListOnThisField').val());
    let settings = $('#makeAListOnThisField').val().split(",")
    console.log(settings);
    let flexfieldTarget = settings[0];
    let flexFieldSource = settings[1];
    console.log(settings[0]);
    console.log(settings[1]);
    // alert("Hello! I am an alert from its own JS file.");
    var existingValue = $("#" + flexFieldSource + "-autosuggest-span").val();
    var storedValues = $("[name="+ flexfieldTarget +"]").val();
    var style = "<style> #addButton:hover {background-color: #00ff20;color: black;} #addButton {  background-color: #15bcff;  border-radius: 5px; border: none;  color: white;  padding: 10px 10px;  text-align: center;  text-decoration: none;  display: inline-block;  font-size: 14px;  margin: 4px 5px;  cursor: pointer;} #minusButton:hover{background-color: #ff3030;color: white;} #minusButton {  background-color: #f8a0a0;  border-radius: 5px; border: none;  color: white;  padding: 10px 10px;  text-align: center;  text-decoration: none;  display: inline-block;  font-size: 14px;  margin: 4px 5px;  cursor: pointer;}</style>";
    // red color: #ff3030
    // var buttonTemplate = "<span id='temp'><button type=\"button\" className=\"btn btn-info btn-sm\" id=\"addButton\" style=\"padding: 1px 1px 1px 1px;\"><i className=\"fas fa-plus-circle\"> + </i></button></span>";
    var flexButton = style + buildButton("addButton"," + ");
    var containerCounter = -1;

    $("input[name='" + flexFieldSource + "']").after(flexButton);
    // uncomment the next line once ready for prod.
    $("[name='"+ flexfieldTarget +"']").hide();

    // Build exiting list values and their fields if they exist
    var counterUpdate = checkForData(storedValues);
    //console.log("this is the return of array length: " + counterUpdate + "<<<<");
    containerCounter = (!counterUpdate) ? containerCounter : counterUpdate;

    $('#taddButton').on('click', '#addButton', function( e ) {
        //console.log("This is the latest containter count: " + getLatestElementIndexNumber());
        containerCounter++;
        checkfield(containerCounter);
        removeElementHandler();
    });

    removeElementHandler();

    function checkfield(counter) {
        if ($("#" + flexFieldSource + "-autosuggest-span").val() != "") {
            //console.log("we got a value");
            //console.log("this is the current counter: " + counter);
            //console.log("this is the the latest element index: " + getLatestElementIndexNumber());
            counter = parseInt(getLatestElementIndexNumber()) + 1 == counter ? counter : parseInt(getLatestElementIndexNumber()) + 1;
            //console.log("this is the current counter after its check: " + counter);
            var newVal = "";
            var curVal = $("#" + flexFieldSource + "-autosuggest-span").val() + " (" + $("input[name='" + flexFieldSource + "']").val() + ")";
            var textFieldTemplate = createNewTextField(counter, "");
            var currentContainerName = 'bioflexfield_' + counter;
            var previousContainerName = 'bioflexfield_' + (counter-1);

            if ($("[name ='"+ flexfieldTarget +"']").val() != ""){
                // newVal = $("[name ='bioflexfield']").val() + "|" + $('#biop01-autosuggest-span').val();
                newVal = $("[name ='"+ flexfieldTarget +"']").val() + "|" + curVal;
                $("[name=" + previousContainerName +"]").after(textFieldTemplate);
            } else {
                // This is the first value
                // newVal = $('#biop01-autosuggest-span').val();
                newVal = curVal;
                $("[name='"+ flexfieldTarget +"']").after(textFieldTemplate);
            }

            $("[name ='"+ flexfieldTarget +"']").val(newVal);
            $("[name=" + currentContainerName + "]").val(curVal);
            // reset source field so it is not saved with a value
            $("#" + flexFieldSource + "-autosuggest-span").val("");
            $("input[name='" + flexFieldSource + "']").val("");

        } else {
            //console.log("the field is empty");
        }
    }

    function createNewTextField(containerNumber, value){
        var textFieldTemplate = "<input autocomplete=\"new-password\" aria-labelledby=\"label-bioflexfield\" class=\"x-form-text x-form-field flex-field-element\" type=\"text\" name=\"bioflexfield_" + containerNumber + "\" value=\"" + value +"\" tabindex=\"0\">";
        //return "<span id=\"sp_"+containerNumber+"\">" + textFieldTemplate + "</span>";
        return textFieldTemplate;
    }

    function checkForData(dataList){
        if(dataList.length === 0){
            //console.log("data list is empty");
            return null;
        } else {
            // array exists and is not empty
            // add each value in their own text field with their respective delete button

            //console.log("Not Empty");
           // console.log(dataList);
            //console.log(dataArray);
            var dataArray = dataList.split("|");
            dataArray.forEach(buildElementWithValue);
            return dataArray.length - 1;
            // return dataArray.length;
        }
    }

    function buildElementWithValue(value, index, array){
        //console.log("building field: " + index + " value: " + value);
        if(index == 0){
            // It's the first element; attach it next to the REDCap field
            var textFieldTemplate = createNewTextField(index, value);
            $("[name='"+ flexfieldTarget +"']").after(textFieldTemplate);
        } else {
            var textFieldTemplate = createNewTextField(index, value);
            var previousIndex = index-1;
            $("[name=\"bioflexfield_" + previousIndex + "\"]").after(textFieldTemplate);
            //$('#sp_' + previousIndex + '').after(textFieldTemplate);
        }
    }

    function removeThisDataIndex(value, index, array){

    }

    function buildButton(id,label){
        return "<span id='t" + id + "'><button className=\"btn btn-info btn-sm\" id=\"" + id + "\" style=\"padding: 4px 4px 4px 4px\" type=\"button\"><i className=\"fas fa-plus-circle\">" + label + "</i></button></span>";
    }
    // function myFunction123() {
    //     console.log("test123");
    // }

    function removeElementHandler(){
        $('.flex-field-element').focus(function(){
            $('#minusButton').remove();
            $("#tminusButton").remove();
            $(this).after(buildButton("minusButton","–"));
            $("#tminusButton").click(function(){
                //console.log("test123");
                //console.log($(this).prev().css({"color": "red", "border": "2px solid red"}));
                //console.log($(this).prev().attr("name"));
                // $(this).fadeOut();
                var gettingIndex = $(this).prev().attr("name").split("_");
                elementIndex = gettingIndex[1];
                //console.log(elementIndex);
                // remove from flex field the data from the index on elementIndex
                var dataArray2 = $("[name='"+ flexfieldTarget +"']").val().split("|");
                //console.log(dataArray2);
                let newArray = dataArray2.splice(elementIndex, 1); // Creates a new array without the element 3
                // now piece it back together
                newString = dataArray2.join("|");
               // console.log(newArray);
               // console.log(dataArray2);
                $("[name ='"+ flexfieldTarget +"']").val(newString);
                // Note: there must be no counterUpdate (it's being used for uniquely naming each element).
                // In this way, removing an element doesn't interfeere with the naming of additional elements.
                // counterUpdate = dataArray2.length - 1;
                // containerCounter = (!counterUpdate) ? containerCounter : counterUpdate;
                $(this).prev().remove();
                $(this).remove();
                // return getLatestElementIndexNumber();
            });
        });
    }

    function getLatestElementIndexNumber(){
        var els = document.getElementsByClassName("flex-field-element");
        if(els.length == 0 ){
            return -1;
        } else {
            return els[els.length-1].name.split("_")[1];
        }
    }

})

