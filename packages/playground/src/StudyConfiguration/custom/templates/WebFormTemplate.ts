import * as fs from "fs";
import { FreModelUnit, FreModel, FreNode, FreLanguage, LwChunk, FreLogger, FreLionwebSerializer } from "@freon4dsl/core";
import { StudyConfigurationModelEnvironment } from "../../config/gen/StudyConfigurationModelEnvironment";  
import {StudyConfiguration, WorkflowDescription, Event } from "../../language/gen/index";  

export class WebformTemplate {

  public static loadModel(modelName: string): StudyConfiguration {
      FreLogger.muteAllLogs();
      const tmp = StudyConfigurationModelEnvironment.getInstance();
      const serializer = new FreLionwebSerializer();
      console.log("current directory:"+process.cwd());
      let metaModel: LwChunk = JSON.parse(fs.readFileSync(`./src/StudyConfiguration/custom/__tests__/modelstore/StudyConfiguration/${modelName}.json`).toString());
      const ts = serializer.toTypeScriptInstance(metaModel);
      let model: StudyConfiguration = ts as StudyConfiguration;
      return model;
    }
  
    public static writeWebForms(model: StudyConfiguration) {
      model.periods.forEach((period, periodNumber) => {
        // log("Period Name:" + period.name);
        period.events.forEach((event, eventNumber) => {
          // log("Event Name:" + event.name);
          // Get the list of activities that go on this form
          var activities = event.checkList.activities;
          var template = `# TASK WEBFORM - ${event.name} 
langcode: en
status: open
dependencies: {  }
weight: 0
open: null
close: null
uid: 1
template: false
archive: false
id: ${event.freId}
title: ${event.name}
description: ''
categories:
  - Task
elements: |-
  placeholder_for_expand_collapse:
    '#type': details
    '#title': placeholder_for_expand_collapse
    '#title_display': invisible
    '#states':
      invisible:
        - ':input[name="step_1"]':
            checked: true
        - or
        - ':input[name="step_1"]':
            unchecked: true
    '#access_create_roles':
      - authenticated
    '#access_update_roles':
      - authenticated
    '#access_view_roles':
      - authenticated
${activities.map ((a, counter) => `<#list steps?values as step>
  step_${counter}:
    '#type': checkbox
    '#title': 'Step ${counter} - ${a.name}'
    '#wrapper_attributes':
      class:
        - step-header
  step${counter}_details:
    '#type': details
    '#title': Details
    '#title_display': invisible
    '#attributes':
      class:
        - step-content
    step${counter}_instructions:
      '#type': processed_text
      '#text': '<div id="container" class="step-detail"><div id="definition" class="step-detail-definition"><ul><li>${((a.decision as WorkflowDescription).text)}</li></ul></div></div>'
      '#format': full_html`
)}
  submit_buttons:
    '#type': webform_flexbox
    complete:
      '#type': webform_actions
      '#title': 'Complete Now'
      '#flex': 0
      '#attributes':
        class:
          - task-primary-button
      '#submit__label': 'Complete Now'
      '#update__label': 'Complete Now'
    complete_later:
      '#type': webform_actions
      '#title': 'Complete Later'
      '#flex': 0
      '#attributes':
        class:
          - task-secondary-button
      '#submit__label': 'Complete Later'
      '#update__label': 'Complete Later'
css: ''
javascript: ''
settings:
  ajax: false
  ajax_scroll_top: form
  ajax_progress_type: ''
  ajax_effect: ''
  ajax_speed: null
  page: true
  page_submit_path: ''
  page_confirm_path: ''
  page_theme_name: ''
  form_title: source_entity_webform
  form_submit_once: true
  form_open_message: ''
  form_close_message: ''
  form_exception_message: ''
  form_previous_submissions: false
  form_confidential: false
  form_confidential_message: ''
  form_disable_remote_addr: false
  form_convert_anonymous: false
  form_prepopulate: false
  form_prepopulate_source_entity: false
  form_prepopulate_source_entity_required: false
  form_prepopulate_source_entity_type: ''
  form_unsaved: false
  form_disable_back: true
  form_submit_back: false
  form_disable_autocomplete: false
  form_novalidate: false
  form_disable_inline_errors: false
  form_required: false
  form_autofocus: false
  form_details_toggle: false
  form_reset: false
  form_access_denied: default
  form_access_denied_title: ''
  form_access_denied_message: ''
  form_access_denied_attributes: {  }
  form_file_limit: ''
  form_attributes: {  }
  form_method: ''
  form_action: ''
  share: false
  share_node: false
  share_theme_name: ''
  share_title: true
  share_page_body_attributes: {  }
  submission_label: ''
  submission_exception_message: ''
  submission_locked_message: ''
  submission_log: false
  submission_excluded_elements: {  }
  submission_exclude_empty: false
  submission_exclude_empty_checkbox: false
  submission_views: {  }
  submission_views_replace: {  }
  submission_user_columns: {  }
  submission_user_duplicate: false
  submission_access_denied: default
  submission_access_denied_title: ''
  submission_access_denied_message: ''
  submission_access_denied_attributes: {  }
  previous_submission_message: ''
  previous_submissions_message: ''
  autofill: false
  autofill_message: ''
  autofill_excluded_elements: {  }
  wizard_progress_bar: true
  wizard_progress_pages: false
  wizard_progress_percentage: false
  wizard_progress_link: false
  wizard_progress_states: false
  wizard_start_label: ''
  wizard_preview_link: false
  wizard_confirmation: true
  wizard_confirmation_label: ''
  wizard_auto_forward: true
  wizard_auto_forward_hide_next_button: false
  wizard_keyboard: true
  wizard_track: ''
  wizard_prev_button_label: ''
  wizard_next_button_label: ''
  wizard_toggle: false
  wizard_toggle_show_label: ''
  wizard_toggle_hide_label: ''
  wizard_page_type: container
  wizard_page_title_tag: h2
  preview: 0
  preview_label: ''
  preview_title: ''
  preview_message: ''
  preview_attributes: {  }
  preview_excluded_elements: {  }
  preview_exclude_empty: true
  preview_exclude_empty_checkbox: false
  draft: none
  draft_multiple: false
  draft_auto_save: false
  draft_saved_message: ''
  draft_loaded_message: ''
  draft_pending_single_message: ''
  draft_pending_multiple_message: ''
  confirmation_type: page
  confirmation_url: ''
  confirmation_title: ''
  confirmation_message: ''
  confirmation_attributes: {  }
  confirmation_back: true
  confirmation_back_label: ''
  confirmation_back_attributes: {  }
  confirmation_exclude_query: false
  confirmation_exclude_token: false
  confirmation_update: false
  limit_total: null
  limit_total_interval: null
  limit_total_message: ''
  limit_total_unique: false
  limit_user: null
  limit_user_interval: null
  limit_user_message: ''
  limit_user_unique: false
  entity_limit_total: null
  entity_limit_total_interval: null
  entity_limit_user: null
  entity_limit_user_interval: null
  purge: none
  purge_days: null
  results_disabled: false
  results_disabled_ignore: false
  results_customize: false
  token_view: false
  token_update: false
  token_delete: false
  serial_disabled: false
access:
  create:
    roles:
      - authenticated
    users: {  }
    permissions: {  }
  view_any:
    roles:
      - authenticated
    users: {  }
    permissions: {  }
  update_any:
    roles:
      - authenticated
    users: {  }
    permissions: {  }
  delete_any:
    roles:
      - authenticated
    users: {  }
    permissions: {  }
  purge_any:
    roles: {  }
    users: {  }
    permissions: {  }
  view_own:
    roles: {  }
    users: {  }
    permissions: {  }
  update_own:
    roles: {  }
    users: {  }
    permissions: {  }
  delete_own:
    roles: {  }
    users: {  }
    permissions: {  }
  administer:
    roles: {  }
    users: {  }
    permissions: {  }
  test:
    roles: {  }
    users: {  }
    permissions: {  }
  configuration:
    roles: {  }
    users: {  }
    permissions: {  }
handlers: {  }
variants: {  }`;

          this.writeWebFormToFile(template, event.name);
        });
      });
    }

    private static writeWebFormToFile(webFormYaml: string, formName: string) {
      // log("template:" + webFormYaml);
      var fileName = `${formName}.yaml`;
      if (fs.existsSync(fileName)) {
        try {
          fs.unlinkSync(fileName);
          // log(`${fileName} has been removed`);
        } catch (err) {
          console.error(`Error removing file ${fileName}: ${err}`);
        }
      }
      try {
        fs.writeFileSync(fileName, webFormYaml);
        // log(`${fileName} has been written`);
      } catch (err) {
        console.error('Error writing file:', err);
      }
    }

}