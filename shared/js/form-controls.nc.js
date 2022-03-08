// This is the JS that powers the benefit calculator.
// Its responsibilities includes:
//     * Front-end validation for the calculator form
//     * Sending user input to the SnapAPI library
//     * Rendering results, including explanations

// The JS is organized into four main objects:
//     * DOM_MANIPULATORS: Functions for maniuplating the DOM: show/hide, error states
//     * STATE_OPTIONS: Data on next steps for applying for SNAP or seeking food assistance, which vary by state
//     * FORM_CONTROLS: A layer of abstraction over DOM_MANIPULATORS; DOM manipulation funcs + specific form elements
//     * FORM_SUBMIT_FUNCS: Functions for handling form submission, results and error state rendering

// This file is written in ES6 and compiled down to more universally browser-compatible JS with `npm run build`.
(() => {
  // Shortcuts for manipulating the DOM. A micromicro framework, if you will.
  const DOM_MANIPULATORS = {
    showElem: (elem_id) => {
      return () => {
        const elem = document.getElementById(elem_id);
        if (elem) {
          if (elem.classList.contains("hidden")) {
            elem.classList.remove("hidden");
          }
        }
      };
    },
    hideElem: (elem_id) => {
      return () => {
        const elem = document.getElementById(elem_id);
        if (elem) {
          if (!elem.classList.contains("hidden")) {
            elem.classList.add("hidden");
          }
        }
      };
    },
    fieldErrorHTML: (message, role, aria_live_level) => {
      return `<div class="usa-alert usa-alert--error usa-alert--slim">
                    <div class="usa-alert__body" role="${role}" aria-live="${aria_live_level}">
                        <em class="usa-alert__text">${message}</em>
                    </div>
                </div>`;
    },
    validateNumberField: (elem_id) => {
      return (event) => {
        const number_field_valid = FORM_CONTROLS["numberFieldValid"](
          event.target.value
        );
        const input_elem = document.getElementById(elem_id);
        const error_elem = document.getElementById(`${elem_id}_error_elem`);

        if (number_field_valid) {
          error_elem.innerHTML = "";
          input_elem.setAttribute("aria-invalid", "false");
        } else {
          error_elem.innerHTML = DOM_MANIPULATORS["fieldErrorHTML"](
            "<b>Please enter a number.</b>",
            "alert",
            "assertive"
          );
          input_elem.setAttribute("aria-invalid", "true");
        }
      };
    },
    clearClientErrorOnSelect: (error_elem_id) => {
      const error_field_elem = document.getElementById(
        `${error_elem_id}_error_elem`
      );
      if (error_field_elem) {
        error_field_elem.innerHTML = "";
      }

      let error_input_elem_by_id = document.getElementById(error_elem_id); // Non-radio buttons
      let error_input_elem_by_name =
        document.getElementsByName(error_elem_id)[0]; // Radio buttons

      if (error_input_elem_by_id) {
        error_input_elem_by_id.setAttribute("aria-invalid", "false");
      }
      if (error_input_elem_by_name) {
        error_input_elem_by_name.setAttribute("aria-invalid", "false");
      }
    },
  };

  const STATE_OPTIONS = {
    // For each state, an array of Object-shaped options.
    // `apply` options include URLs and descriptions of how a household can apply.
    // `other_resources` options include URLs and descriptions of non-SNAP food resources.
    NC: {
      apply: [
        {
          url: "https://ncfast.nc.gov/Curam/logon.jsp",
          description: "Apply online using NCFast.",
        },
        {
          url: "https://www.ncdhhs.gov/media/2368/open",
          description:
            "Apply in person at your county's Department of Social Services.",
        },
      ],
      other_resources: [
        {
          url: "https://nc211.org/",
          description: "Search via NC211",
        },
      ],
    },
  };

  // Shortcuts for showing/hiding specific elements on the page.
  const FORM_CONTROLS = {
    showCitizenshipInfobox: DOM_MANIPULATORS["showElem"](
      "citizenship_info_box"
    ),
    hideCitizenshipInfobox: DOM_MANIPULATORS["hideElem"](
      "citizenship_info_box"
    ),
    showIneligible_Immigration: DOM_MANIPULATORS["showElem"](
      "ineligible_immigration_question"
    ),
    hideIneligible_Immigration: DOM_MANIPULATORS["hideElem"](
      "ineligible_immigration_question"
    ),

    // Number disqualified

    showNumberDisqualified: DOM_MANIPULATORS["showElem"](
      "ineligible_disqualified_question"
    ),
    hideNumberDisqualified: DOM_MANIPULATORS["hideElem"](
      "ineligible_disqualified_question"
    ),

    // WIC

    showWICBox: DOM_MANIPULATORS["showElem"]("WIC_info_box"),
    hideWICBox: DOM_MANIPULATORS["hideElem"]("WIC_info_box"),

    // form controls for results

    // WIC Results

    showWICResults: DOM_MANIPULATORS["showElem"]("optional-WIC"),
    hideWICResults: DOM_MANIPULATORS["hideElem"]("optional-WIC"),

    // ABAWD Results

    showABAWDResults: DOM_MANIPULATORS["showElem"]("optional-ABAWD"),
    hideABAWDResults: DOM_MANIPULATORS["hideElem"]("optional-ABAWD"),

    //Immigration Results

    showImmigrationResults: DOM_MANIPULATORS["showElem"](
      "optional-immigration"
    ),
    hideImmigrationResults: DOM_MANIPULATORS["hideElem"](
      "optional-immigration"
    ),

    // Advocate Results

    showAdvocateResults: DOM_MANIPULATORS["showElem"]("optional-advocate"),
    hideAdvocateResults: DOM_MANIPULATORS["hideElem"]("optional-advocate"),

    // Know Your Rights Results

    showKnowYourRights: DOM_MANIPULATORS["showElem"](
      "optional-know-your-rights"
    ),
    hideKnowYourRights: DOM_MANIPULATORS["hideElem"](
      "optional-know-your-rights"
    ),

    // End Results

    showABAWDInfobox: DOM_MANIPULATORS["showElem"]("abawd_info_box"),
    hideABAWDInfobox: DOM_MANIPULATORS["hideElem"]("abawd_info_box"),
    showMedicalExpensesForElderlyOrDisabled: DOM_MANIPULATORS["showElem"](
      "medical_expenses_for_elderly_or_disabled_question"
    ),
    hideMedicalExpensesForElderlyOrDisabled: DOM_MANIPULATORS["hideElem"](
      "medical_expenses_for_elderly_or_disabled_question"
    ),
    hideServerErrorMessages: DOM_MANIPULATORS["hideElem"](
      "server-error-messages"
    ),
    showServerErrorMessages: DOM_MANIPULATORS["showElem"](
      "server-error-messages"
    ),
    hideResults: DOM_MANIPULATORS["hideElem"]("results-section"),
    showResults: DOM_MANIPULATORS["showElem"]("results-section"),
    numberFieldValid: (value) => {
      if (value === "") return true; // Fields can be blank

      return !isNaN(parseInt(value));
    },
  };

  // Handles form submission and rendering results.
  const FORM_SUBMIT_FUNCS = {
    checkForm: () => {
      // Pull input data from the form:
      const form = document.getElementById("prescreener-form");
      const elements = form.elements;
      const jsonData = {};

      for (let i = 0; i < elements.length; i++) {
        let elem = elements[i];

        switch (elem.type) {
          case "select-one":
            jsonData[elem.id] = elem.value;
            break;
          case "radio": {
            let checked = document.querySelector(
              `input[name="${elem.name}"]:checked`
            );
            checked
              ? (jsonData[elem.name] = checked.value)
              : (jsonData[elem.name] = undefined);
            break;
          }
          case "text":
            jsonData[elem.id] = elem.value;
            break;
        }
      }

      // Validate:
      const errors = [];

      if (jsonData["identify__user"] === undefined) {
        errors.push({
          name: "identify__user",
          message:
            "Before We Begin: Please indicate why you are using this calculator.",
        });
      }

      if (jsonData["household_size"] === "") {
        errors.push({
          name: "household_size",
          message: "Step 1: Enter a household size.",
        });
      }

      if (
        jsonData["household_size"] -
          (jsonData["household_size"] - jsonData["ineligible_immigration"]) -
          jsonData["ineligible_disqualified"] <
        1
      ) {
        errors.push({
          name: "household_size_zero",
          message:
            "Step 1: Your current household size, adjusted for disqualifications, is zero. Please adjust your household size, number of lawfully present immigrants, or number of disqualified so that at least one household member is both 1) lawfully present in the U.S. and 2) not disqualified from food stamps for a drug felony or a program violation.",
        });
      }

      if (jsonData["all_citizens_question"] === undefined) {
        errors.push({
          name: "all_citizens_question",
          message:
            'Step 1: Select "yes" or "no" if everyone on the application is a U.S. citizen',
        });
      }

      if (jsonData["household_includes_elderly_or_disabled"] === undefined) {
        errors.push({
          name: "household_includes_elderly_or_disabled",
          message:
            'Step 1: Select "yes" or "no" if your household includes someone who is 60 or older, or someone who is disabled.',
        });
      }

      if (jsonData["felony_question"] === undefined) {
        errors.push({
          name: "felony_question",
          message:
            'Step 1: Select "yes" or "no" if anyone in the household has been convicted of a drug-related felony since August 23, 1996.',
        });
      }

      if (jsonData["household_includes_abawd"] === undefined) {
        errors.push({
          name: "household_includes_abawd",
          message:
            'Step 1: Select "yes" or "no" if someone in your household is between ages 18-49.',
        });
      }

      if (jsonData["disqualified_question"] === undefined) {
        errors.push({
          name: "disqualified_question",
          message:
            'Step 1: Select "yes" or "no" if anyone in the household is currently disqualified.',
        });
      }

      if (jsonData["monthly_job_income"] === "") {
        errors.push({
          name: "monthly_job_income",
          message:
            "Step 2: Enter monthly household pre-tax income from jobs or self-employment",
        });
      }

      if (jsonData["monthly_non_job_income"] === "") {
        errors.push({
          name: "monthly_non_job_income",
          message: "Step 2: Enter monthly household income from other sources.",
        });
      }

      if (jsonData["resources"] === "") {
        errors.push({
          name: "resources",
          message: "Step 2: Enter total resources amount.",
        });
      }

      // Validation for number fields:
      const number_field_ids = [
        "household_size",
        "ineligible_immigration",
        "ineligible_disqualified",
        "monthly_job_income",
        "monthly_non_job_income",
        "resources",
        "dependent_care_costs",
        "medical_expenses_for_elderly_or_disabled",
        "court_ordered_child_support_payments",
        "rent_or_mortgage",
        "homeowners_insurance_and_taxes",
        "utility_costs",
      ];

      for (let i = 0; i < number_field_ids.length; i++) {
        let field_id = number_field_ids[i];
        const number_elem = document.getElementById(field_id);

        if (number_elem) {
          if (!FORM_CONTROLS["numberFieldValid"](number_elem.value)) {
            errors.push({
              name: field_id,
              message: `You have entered letters in one or more answers that require a number value.`,
            });
          }
        }
      }

      // Only auto-update the error message state if the user
      // has already attempted to submit and received error messages.
      if (window.hasShownErrors) {
        FORM_SUBMIT_FUNCS["updateClientErrorMessages"](errors);
      }

      return {
        errors: errors,
        jsonData: jsonData,
      };
    },
    onSubmit: () => {
      const checkFormResults = FORM_SUBMIT_FUNCS["checkForm"]();
      const errors = checkFormResults["errors"];
      const jsonData = checkFormResults["jsonData"];

      if (errors.length === 0) {
        // If valid, send data to API library:
        FORM_SUBMIT_FUNCS["sendData"](jsonData);
        document.getElementById("prescreener-form").style.display = "none";
      } else {
        window.hasShownErrors = true;
        FORM_SUBMIT_FUNCS["updateClientErrorMessages"](errors);

        const errors_header = document.getElementById("errors-header");
        errors_header.scrollIntoView();

        const first_error_elem = document.querySelector(
          '[aria-invalid="true"]'
        );
        if (first_error_elem) {
          first_error_elem.focus();
        }
      }
    },
    updateClientErrorMessages: (errors) => {
      const errors_header = document.getElementById("errors-header");
      let errors_header_html = "";

      if (errors.length === 0) {
        errors_header.innerHTML = errors_header_html;
        return;
      }

      // Set per-field client side errors first ...
      for (let i = 0; i < errors.length; i++) {
        let error = errors[i];
        let error_name = error["name"];
        let error_message = error["message"];
        let error_field_elem = document.getElementById(
          `${error_name}_error_elem`
        );
        let error_input_elem_by_id = document.getElementById(error_name); // Non-radio buttons
        let error_input_elem_by_name =
          document.getElementsByName(error_name)[0]; // Radio buttons

        if (error_field_elem) {
          let error_message_alert = DOM_MANIPULATORS["fieldErrorHTML"](
            error_message,
            "",
            "off"
          );
          error_field_elem.innerHTML = error_message_alert;
        }

        if (error_input_elem_by_id) {
          error_input_elem_by_id.setAttribute("aria-invalid", "true");
        }
        if (error_input_elem_by_name) {
          error_input_elem_by_name.setAttribute("aria-invalid", "true");
        }
      }

      // ... and set overall error list afterwards, so that VoiceOver will
      // read it out immediately due to its role="alert" attribute.
      errors_header_html += `<p class="error-total"> We could not estimate your benefit amount because there ${
        errors.length === 1 ? "was" : "were"
      } ${errors.length} ${
        errors.length === 1 ? "error" : "errors"
      }.</p><p>Please review your answers and correct the following:`;
      errors_header_html += `<ul class="usa-list">`;
      for (let i = 0; i < errors.length; i++) {
        let error = errors[i];
        errors_header_html += `<li><p>${error["message"]}</p></li>`;
      }
      errors_header_html += `</ul>`;

      errors_header.innerHTML = errors_header_html;
    },
    sendData: (jsonData) => {
      // Send state_or_territory and emergency allotment config to API
      // in addition to user input data:
      const form = document.getElementById("prescreener-form");
      jsonData["state_or_territory"] = form.dataset.stateOrTerritory;
      //  jsonData["use_emergency_allotment"] = form.dataset.useEmergencyAllotment; // I can probably remove this now
      jsonData["target_year"] = "currentyr";

      const response = new SnapAPI.SnapEstimateEntrypoint(jsonData).calculate();

      FORM_SUBMIT_FUNCS["responseToHTML"](response);
    },
    responseToHTML: (response) => {
      if (response.status !== "OK") {
        FORM_CONTROLS["hideResults"]();
        FORM_CONTROLS["hideExplanationButton"]();
        FORM_CONTROLS["hideResultExplanation"]();

        const errorsHTML = FORM_SUBMIT_FUNCS["responseErrorsToHTML"](
          response.errors
        );
        document.getElementById("server-error-messages").innerHTML = errorsHTML;

        FORM_CONTROLS["showServerErrorMessages"]();
        return;
      }

      const resultHTML = FORM_SUBMIT_FUNCS["resultToHTML"](response);
      document.getElementById("results").innerHTML = resultHTML;

      const eligibilityExplanationHTML = FORM_SUBMIT_FUNCS[
        "eligibilityExplanationToHTML"
      ](response.eligibility_factors);
      document.getElementById("why-did-i-get-this-result").innerHTML =
        eligibilityExplanationHTML;

      const incomeExplanationHTML = FORM_SUBMIT_FUNCS[
        "incomeExplanationToHTML"
      ](response.eligibility_factors);
      document.getElementById(
        "how-are-gross-and-net-income-calculated"
      ).innerHTML = incomeExplanationHTML;

      FORM_CONTROLS["showResults"]();
      FORM_CONTROLS["hideServerErrorMessages"]();
    },
    responseErrorsToHTML: (errors) => {
      let html = `<h1>Errors:</h1>`;

      for (let i = 0; i < errors.length; i++) {
        let error = errors[i];

        html += `<li>${error}</li>`;
      }

      return html;
    },
    optionsHTML: (options_array, options_title) => {
      let html = `<p>${options_title}
                            <ul class="usa-link">`;

      for (let i = 0; i < options_array.length; i++) {
        let option = options_array[i];

        html += `<li>
                        <a class="usa-link" href="${option.url}" rel="noopener noreferrer" target="_blank">
                            ${option.description}
                        </a>
                    </li>`;
      }

      html += `</ul></p>`;
      return html;
    },
    resultToHTML: (response) => {
      let html = '<h2 id="results-section-title">Results:</h2>';

      const is_eligible = response.estimated_eligibility;
      const estimated_monthly_benefit = response.estimated_monthly_benefit;
      const emergency_allotment_estimated_benefit =
        response.emergency_allotment_estimated_benefit;

      const formSettings = document.getElementById("prescreener-form");
      const stateAbbr = formSettings.dataset.stateOrTerritory;
      const nextStepOptions = STATE_OPTIONS[stateAbbr];

      // SNAP JS API estimates household is ineligible:
      if (!is_eligible) {
        html += `<p>You <strong>might not</strong> be eligible for SNAP benefits.</p>
                    <p>This result is only an estimate based on your inputs, not an official application or decision. <strong>You can still apply for SNAP benefits</strong>.</p>`;

        html += FORM_SUBMIT_FUNCS["optionsHTML"](
          nextStepOptions["apply"],
          "Ways to apply:"
        );

        html += FORM_SUBMIT_FUNCS["optionsHTML"](
          nextStepOptions["other_resources"],
          "Other resources for food assistance:"
        );

        html +=
          "<p>Click the tabs below for more information about your results and the food stamps program.</p>";

        return html;
      }

      // SNAP JS API estimates household is eligible:
      html += "<p>You may be <b>eligible</b> for SNAP benefits.</p>";

      // If emergency allotments are active, and estimated benefit is less than EA amount:
      if (
        emergency_allotment_estimated_benefit &&
        estimated_monthly_benefit !== emergency_allotment_estimated_benefit
      ) {
        const additional_amount =
          emergency_allotment_estimated_benefit - estimated_monthly_benefit;

        html += `<p>If you apply and are approved, your benefit may be $${estimated_monthly_benefit} per month.</p><p>Due to the current pandemic, you could receive an additional $${additional_amount} per month. (This additional amount is temporary.)</p>`;
        // If no emergency allotments, or EA is the same as regular benefit amount:
      } else {
        html += `<p>If you apply and are approved, your benefit may be $${estimated_monthly_benefit} per month.</p>`;
      }

      html += FORM_SUBMIT_FUNCS["optionsHTML"](
        nextStepOptions["apply"],
        "Ways to apply:"
      );

      html +=
        "<p>Click the tabs below for more information about your results and the food stamps program.</p>";

      return html;
    },
    eligibilityExplanationToHTML: (eligibility_factors) => {
      let html = "";

      eligibility_factors.sort((a, b) => {
        return a.sort_order - b.sort_order;
      });

      const eligibility_tests = eligibility_factors.filter((factor) => {
        return factor.type === "test";
      });

      for (let i = 0; i < eligibility_tests.length; i++) {
        let eligibility_test = eligibility_tests[i];

        const name = eligibility_test.name;
        const result_in_words = eligibility_test.result ? "Pass" : "Fail";
        const result_span_class = eligibility_test.result
          ? "pass-green"
          : "fail-red";

        html += `<h3>${name}: <span class="${result_span_class}">${result_in_words}</span></h3>`;

        let explanation = eligibility_test.explanation;

        for (var k = 0; k < explanation.length; k++) {
          let explanation_graph = explanation[k];
          html += `<p>${explanation_graph}</p>`;
        }
      }

      const eligibility_amount = eligibility_factors.filter((factor) => {
        return factor.type === "amount";
      })[0];

      html += `<h2>${eligibility_amount.name}</h2>`;

      for (let i = 0; i < eligibility_amount.explanation.length; i++) {
        let explanation_graph = eligibility_amount.explanation[i];
        html += `<p>${explanation_graph}</p>`;
      }

      return html;
    },
    incomeExplanationToHTML: (eligibility_factors) => {
      let html = "";

      eligibility_factors.sort((a, b) => {
        return a.sort_order - b.sort_order;
      });

      const income_factors = eligibility_factors.filter((factor) => {
        return factor.type === "income";
      });

      for (let i = 0; i < income_factors.length; i++) {
        let income_factor = income_factors[i];
        const name = income_factor.name;
        const explanation_graphs = income_factor.explanation;

        html += `<h3>${name}</h3>`;

        for (var k = 0; k < explanation_graphs.length; k++) {
          let explanation_graph = explanation_graphs[k];
          html += `<p>${explanation_graph}</p>`;
        }
      }

      return html;
    },
  };

  // Set up form submit function.
  document
    .getElementById("prescreener-form")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      FORM_SUBMIT_FUNCS["onSubmit"]();
    });

  // Set up advocate results (note: three options)

  document.getElementById("input__advocate").addEventListener("change", () => {
    FORM_CONTROLS["showAdvocateResults"]();
  });

  document.getElementById("input__lanc").addEventListener("change", () => {
    FORM_CONTROLS["showAdvocateResults"]();
  });

  document
    .getElementById("input__general__public")
    .addEventListener("change", () => {
      FORM_CONTROLS["hideAdvocateResults"]();
    });

  // Set up general public results (know your rights)

  document
    .getElementById("input__general__public")
    .addEventListener("change", () => {
      FORM_CONTROLS["showKnowYourRights"]();
    });

  document.getElementById("input__lanc").addEventListener("change", () => {
    FORM_CONTROLS["hideKnowYourRights"]();
  });

  document.getElementById("input__advocate").addEventListener("change", () => {
    FORM_CONTROLS["hideKnowYourRights"]();
  });

  // Set up WIC info box

  document
    .getElementById("input__WIC_question_true")
    .addEventListener("change", () => {
      FORM_CONTROLS["showWICBox"]();
    });

  document
    .getElementById("input__WIC_question_false")
    .addEventListener("change", () => {
      FORM_CONTROLS["hideWICBox"]();
    });

  // Set up WIC results

  document
    .getElementById("input__WIC_question_true")
    .addEventListener("change", () => {
      FORM_CONTROLS["showWICResults"]();
    });

  document
    .getElementById("input__WIC_question_false")
    .addEventListener("change", () => {
      FORM_CONTROLS["hideWICResults"]();
    });

  // Set up toggle of citizenship infobox in response to citizenship question.

  document
    .getElementById("input__all_citizens_question_true")
    .addEventListener("change", () => {
      FORM_CONTROLS["hideCitizenshipInfobox"]();
    });

  document
    .getElementById("input__all_citizens_question_false")
    .addEventListener("change", () => {
      FORM_CONTROLS["showCitizenshipInfobox"]();
    });

  // Set up optional result immigration

  document
    .getElementById("input__all_citizens_question_false")
    .addEventListener("change", () => {
      FORM_CONTROLS["showImmigrationResults"]();
    });

  document
    .getElementById("input__all_citizens_question_true")
    .addEventListener("change", () => {
      FORM_CONTROLS["hideImmigrationResults"]();
    });

  // Set up toggle of lawfully present question.

  document
    .getElementById("input__all_citizens_question_false")
    .addEventListener("change", () => {
      FORM_CONTROLS["showIneligible_Immigration"]();
      document.getElementById("ineligible_immigration").value = "";
    });

  document
    .getElementById("input__all_citizens_question_true")
    .addEventListener("change", () => {
      FORM_CONTROLS["hideIneligible_Immigration"]();
      document.getElementById("ineligible_immigration").value = "";
    });

  // Set up toggle of abawd infobox in response to abawd question.
  document
    .getElementById("input__household_includes_abawd_true")
    .addEventListener("change", () => {
      FORM_CONTROLS["showABAWDInfobox"]();
    });

  document
    .getElementById("input__household_includes_abawd_false")
    .addEventListener("change", () => {
      FORM_CONTROLS["hideABAWDInfobox"]();
    });

  // Set up optional result ABAWD

  document
    .getElementById("input__household_includes_abawd_true")
    .addEventListener("change", () => {
      FORM_CONTROLS["showABAWDResults"]();
    });

  document
    .getElementById("input__household_includes_abawd_false")
    .addEventListener("change", () => {
      FORM_CONTROLS["hideABAWDResults"]();
    });

  // Set up toggle of disqualified question

  document
    .getElementById("input__household_includes_disqualified_true")
    .addEventListener("change", () => {
      document.getElementById("input__household_includes_felony_false")
        .checked === false &&
      document.getElementById("input__household_includes_felony_true")
        .checked === false
        ? FORM_CONTROLS["hideNumberDisqualified"]()
        : FORM_CONTROLS["showNumberDisqualified"]();
      document.getElementById("ineligible_disqualified").value = "";
    });

  document
    .getElementById("input__household_includes_disqualified_false")
    .addEventListener("change", () => {
      document.getElementById("input__household_includes_felony_false")
        .checked &&
      document.getElementById("input__household_includes_disqualified_false")
        .checked
        ? (FORM_CONTROLS["hideNumberDisqualified"](),
          (document.getElementById("ineligible_disqualified").value = ""))
        : FORM_CONTROLS["showNumberDisqualified"]();
    });

  document
    .getElementById("input__household_includes_felony_true")
    .addEventListener("change", () => {
      document.getElementById("input__household_includes_disqualified_false")
        .checked === false &&
      document.getElementById("input__household_includes_disqualified_true")
        .checked === false
        ? FORM_CONTROLS["hideNumberDisqualified"]()
        : FORM_CONTROLS["showNumberDisqualified"]();
      document.getElementById("ineligible_disqualified").value = "";
    });

  document
    .getElementById("input__household_includes_felony_false")
    .addEventListener("change", () => {
      document.getElementById("input__household_includes_felony_false")
        .checked &&
      document.getElementById("input__household_includes_disqualified_false")
        .checked
        ? (FORM_CONTROLS["hideNumberDisqualified"](),
          (document.getElementById("ineligible_disqualified").value = ""))
        : FORM_CONTROLS["showNumberDisqualified"]();
    });

  // Set up toggle of medical expenses question in response to elderly or disabled question result.
  document
    .getElementById("input__household_includes_elderly_or_disabled_true")
    .addEventListener("change", () => {
      FORM_CONTROLS["showMedicalExpensesForElderlyOrDisabled"]();
      document.getElementById(
        "medical_expenses_for_elderly_or_disabled"
      ).value = "";
    });

  document
    .getElementById("input__household_includes_elderly_or_disabled_false")
    .addEventListener("change", () => {
      FORM_CONTROLS["hideMedicalExpensesForElderlyOrDisabled"]();
      document.getElementById(
        "medical_expenses_for_elderly_or_disabled"
      ).value = "";
    });

  // Set up validation for number fields.
  const number_field_ids = [
    "household_size",
    "ineligible_immigration",
    "ineligible_disqualified",
    "monthly_job_income",
    "monthly_non_job_income",
    "resources",
    "dependent_care_costs",
    "medical_expenses_for_elderly_or_disabled",
    "court_ordered_child_support_payments",
    "rent_or_mortgage",
    "homeowners_insurance_and_taxes",
    "utility_costs",
  ];

  for (let i = 0; i < number_field_ids.length; i++) {
    let field_id = number_field_ids[i];
    const number_elem = document.getElementById(field_id);

    if (number_elem) {
      number_elem.addEventListener("input", (event) => {
        DOM_MANIPULATORS["validateNumberField"](field_id)(event);
        FORM_SUBMIT_FUNCS["checkForm"]();
      });
    }
  }

  // Validation for radio fields

  const radio_field_ids = [
    "household_includes_elderly_or_disabled",
    "all_citizens_question",
    "identify__user",
    "household_includes_abawd",
    "felony_question",
    "disqualified_question",
    "identify__user",
  ];

  for (let i = 0; i < radio_field_ids.length; i++) {
    let radio_field_id = radio_field_ids[i];
    let radio_elems = document.getElementsByName(radio_field_id);

    if (radio_elems) {
      for (let k = 0; k < radio_elems.length; k++) {
        let radio_elem = radio_elems[k];
        radio_elem.addEventListener("change", () => {
          DOM_MANIPULATORS["clearClientErrorOnSelect"](radio_field_id);
          FORM_SUBMIT_FUNCS["checkForm"]();
        });
      }
    }
  }
})();
