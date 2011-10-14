var conditions, actions, nameField, ageField, occupationField, submit;
(function($) {
  var occupationOptions = [
    {label: "", value: ""},
    {label: "Software Engineer", value: "software-engineer"},
    {label: "Biz Dev", value: "biz-dev"},
    {label: "Marketing", value: "marketing"}
  ];

  function onReady() {
    conditions = $("#conditions");
    actions = $("#actions");
    nameField = $("#nameField");
    occupationField = $("#occupationField");
    ageField = $("#ageField");
    submit = $("#submit");

    initializeConditions();
    initializeActions();
    initializeForm();
  }

  function initializeConditions() {
    conditions.conditionsBuilder({
      fields: [
        {label: "Name", value: "nameField", operators: [
          {label: "is present", value: "present", fieldType: "none"},
          {label: "is blank", value: "blank", fieldType: "none"},
          {label: "is equal to", value: "equalTo", fieldType: "text"},
          {label: "is not equal to", value: "notEqualTo", fieldType: "text"},
          {label: "includes", value: "includes", fieldType: "text"},
          {label: "matches regex", value: "matchesRegex", fieldType: "text"}
        ]},
        {label: "Age", value: "ageField", operators: [
          {label: "is present", value: "present", fieldType: "none"},
          {label: "is blank", value: "blank", fieldType: "none"},
          {label: "is equal to", value: "equalTo", fieldType: "text"},
          {label: "is not equal to", value: "notEqualTo", fieldType: "text"},
          {label: "is greater than", value: "greaterThan", fieldType: "text"},
          {label: "is greater than or equal to", value: "greaterThanEqual", fieldType: "text"},
          {label: "is less than", value: "lessThan", fieldType: "text"},
          {label: "is less than or equal to", value: "lessThanEqual", fieldType: "text"},
        ]},
        {label: "Occupation", value: "occupationField", options: occupationOptions, operators: [
          {label: "is present", value: "present", fieldType: "none"},
          {label: "is blank", value: "blank", fieldType: "none"},
          {label: "is equal to", value: "equalTo", fieldType: "select"},
          {label: "is not equal to", value: "notEqualTo", fieldType: "select"},
        ]}
      ],
      data: {"all": [
        {field: "nameField", operator: "equalTo", value: "Godzilla"},
        {field: "ageField", operator: "greaterThanEqual", value: "21"}
      ]}
    });
  }

  function initializeActions() {
    actions.actionsBuilder({
      fields: [
        {label: "Show Alert", value: "alert", fields: [
          {label: "Message", value: "message", fieldType: "textarea"}
        ]},
        {label: "Update Field", value: "updateField", fields: [
          {label: "Field", value: "fieldId", fieldType: "select", options: [
            {label: "Name to", value: "nameField", fields: [
              {label: "New Value", value: "newValue", fieldType: "text"}
            ]},
            {label: "Age to", value: "ageField", fields: [
              {label: "New Value", value: "newValue", fieldType: "text"}
            ]},
            {label: "Occupation to", value: "occupationField", fields: [
              {label: "New Value", value: "newValue", fieldType: "select", options: occupationOptions}
            ]}
          ]},
        ]}
      ],
      data: [
        {name: "action-select", value: "alert", fields: [
          {name: "message", value: "Hello world!"}
        ]},
        {name: "action-select", value: "updateField", fields: [
          {name: "fieldId", value: "occupationField", fields: [
            {name: "newValue", value: "marketing"}
          ]}
        ]}
      ]
    });
  }

  function initializeForm() {
    for(var i=0; i < occupationOptions.length; i++) {
      var o = occupationOptions[i];
      occupationField.append($("<option>", {value: o.value, text: o.label}));
    }

    submit.click(function(e) {
      e.preventDefault();
      var engine = new BusinessRules.RuleEngine({
        conditions: conditions.conditionsBuilder("data"),
        actions: actions.actionsBuilder("data")
      });
      var conditionsAdapter = {
        nameField: nameField.val(), 
        ageField: ageField.val(),
        occupationField: occupationField.val()
      };
      var actionsAdapter = {
        alert: function(data) { alert(data.find("message")); },
        updateField: function(data) {
          var fieldId = data.find("fieldId");
          var field = $("#" + fieldId);
          var val = data.find("fieldId", "newValue");
          field.val(val);
        }        
      };
      engine.run(conditionsAdapter, actionsAdapter);
    });
  }
  $(onReady);
})(jQuery);