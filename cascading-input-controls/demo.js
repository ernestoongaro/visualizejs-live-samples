var reportUri = "/public/Samples/Reports/Cascading_Report_2_Updated";
var report, inputControls; 

visualize({
  auth: {
    name: "joe",
    password: "joeuser"
  }
}, function(v) {
  inputControls = v.inputControls({
    resource: reportUri,
    success: renderInputControls
  });
  report = v.report({
    resource: reportUri,
    container: "#container"
  });

  // ...

  $("#Product_Family_selector").on("change", updateCascade);
  $("#Product_Category_selector").on("change", updateCascade);
  $("#Product_Department_selector").on("change", updateCascade);
  $("#Product_Name_selector").on("change", function() {
    //last control in cascade selected: update the report
    report.params(getSelection()).run();
  });
});

function getSelection() {
  var family = getSelectedValues("#Product_Family_selector");
  var category = getSelectedValues("#Product_Category_selector");
  var deparment = getSelectedValues("#Product_Department_selector");
  var names = getSelectedValues("#Product_Name_selector");

  var obj = {};
  if (family != undefined && family.length > 0) {
    obj.Product_Family = family;
  }
  if (category != undefined && category.length > 0) {
    obj.Product_Category = category;
  }
  if (deparment != undefined && deparment.length > 0) {
    obj.Product_Department = deparment;
  }
  if (names != undefined && names.length > 0) {
    obj.Product_Name = names;
  }
  return obj;
}

function getSelectedValues(aSelector) {
  var selectedValues = [];
  var selector = $(aSelector);
  // if we don't get a valid selector, selector.length (of array) will = 0 and eval to false
  if (selector == undefined || selector == null || !selector.length) {
    throw "missing selector: " + aSelector;
  }
  $(aSelector + " :selected").each(function() {
    selectedValues.push($(this).val());
  });
  //console.log(aSelector);
  //console.log(selectedValues)
  return selectedValues;
}

function updateCascade() {
  inputControls
    .params(getSelection())
    .run(function(data) {
      renderInputControls(data);
      //report.params(getSelection()).run();
    });
}

function renderInputControls(data) {
  //console.log(data);

  addOptions(data, "Product_Family");
  addOptions(data, "Product_Category");
  addOptions(data, "Product_Department");
  addOptions(data, "Product_Name");

}

function addOptions(data, selectorId) {
  var ic = _.findWhere(data, {
    id: selectorId
  });
  // for this page, the selector names in HTML have "or" appended to them
  var selector = $("#" + selectorId + "_selector");
  // if we don't get a valid selector, selector.length (of array) will = 0 and eval to false
  if (selector == undefined || selector == null || !selector.length) {
    throw "missing selector: " + selectorId + "_selector";
  } else if (ic == undefined || ic == null) {
    throw "missing input control: " + selectorId;
  }
  selector.empty();
  _.each(ic.state.options, function(option) {
    selector.append("<option " + (option.selected ? "selected" : "") + " value='" + option.value + "'>" + option.label + "</option>");
  });
}

