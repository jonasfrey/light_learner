// Copyright (C) [2026] [Jonas Immanuel Frey] - Licensed under GPLv2. See LICENSE file for details.

import {
    f_o_html_from_o_js,
} from "./lib/handyhelpers.js"

import { f_send_wsmsg_with_response, o_state } from './index.js';

import {
    o_model__o_program,
    f_s_name_table__from_o_model,
    o_wsmsg__f_v_crud__indb,
    f_o_wsmsg,
} from './constructors.js';

let s_name_table = f_s_name_table__from_o_model(o_model__o_program);

let o_component__midi = {
    name: 'component-midi',
    template: (await f_o_html_from_o_js({
        class: "o_midi",
        a_o: [
            {
                class: "o_midi__header",
                a_o: [
                    {
                        s_tag: "h2",
                        innerText: "MIDI Controller",
                    },
                ]
            },
            {
                class: "o_midi__device_bar",
                a_o: [
                    {
                        s_tag: "span",
                        class: "o_midi__label",
                        innerText: "Output device:",
                    },
                    {
                        s_tag: "select",
                        class: "o_midi__select",
                        'v-model': "s_id__device",
                        '@change': "f_select_device",
                        a_o: [
                            {
                                s_tag: "option",
                                disabled: "true",
                                value: "",
                                innerText: "-- select a MIDI device --",
                            },
                            {
                                s_tag: "option",
                                'v-for': "o_device in a_o_device",
                                ':value': "o_device.id",
                                innerText: "{{ o_device.name }}",
                            },
                        ]
                    },
                    {
                        s_tag: "button",
                        class: "btn__midi_refresh",
                        '@click': "f_refresh_devices",
                        innerText: "Refresh",
                    },
                ]
            },
            {
                class: "o_midi__program_bar",
                a_o: [
                    {
                        s_tag: "span",
                        class: "o_midi__label",
                        innerText: "Program:",
                    },
                    {
                        s_tag: "select",
                        class: "o_midi__select",
                        'v-model': "n_id__program",
                        '@change': "f_select_program",
                        a_o: [
                            {
                                s_tag: "option",
                                ':value': "null",
                                innerText: "-- new unsaved --",
                            },
                            {
                                s_tag: "option",
                                'v-for': "o_prog in o_state[s_name_table]",
                                ':value': "o_prog.n_id",
                                innerText: "{{ o_prog.s_name }}",
                            },
                        ]
                    },
                    {
                        s_tag: "button",
                        class: "btn__midi_save",
                        '@click': "f_save_program",
                        innerText: "Save",
                    },
                    {
                        s_tag: "button",
                        class: "btn__midi_new",
                        '@click': "f_new_program",
                        innerText: "New",
                    },
                    {
                        s_tag: "button",
                        class: "btn__midi_delete",
                        'v-if': "n_id__program",
                        '@click': "f_delete_program",
                        innerText: "Delete",
                    },
                ]
            },
            {
                s_tag: "div",
                'v-if': "s_error",
                class: "o_midi__error",
                innerText: "{{ s_error }}",
            },
            {
                class: "o_midi__editor_wrap",
                a_o: [
                    {
                        s_tag: "div",
                        ref: "el_editor",
                        class: "o_midi__editor",
                    },
                ]
            },
            {
                class: "o_midi__actions",
                a_o: [
                    {
                        s_tag: "button",
                        class: "btn__midi_run",
                        '@click': "f_run",
                        ':disabled': "!s_id__device",
                        innerText: "Run",
                    },
                    {
                        s_tag: "span",
                        class: "o_midi__status",
                        innerText: "{{ s_status }}",
                    },
                ]
            },
            {
                s_tag: "pre",
                'v-if': "s_log",
                class: "o_midi__log",
                innerText: "{{ s_log }}",
            },
        ]
    })).outerHTML,
    data: function() {
        return {
            o_state: o_state,
            s_name_table: s_name_table,
            a_o_device: [],
            s_id__device: "",
            n_id__program: null,
            s_error: "",
            s_status: "",
            s_log: "",
        };
    },
    created: function() {
        // keep these off reactive data — Monaco has thousands of properties
        this._o_editor = null;
        this._o_midi_access = null;
    },
    methods: {
        f_refresh_devices: async function() {
            let o_self = this;
            o_self.s_error = "";
            try {
                o_self._o_midi_access = await navigator.requestMIDIAccess({ sysex: true });
                o_self.a_o_device = [];
                o_self._o_midi_access.outputs.forEach(function(o_output) {
                    o_self.a_o_device.push({ id: o_output.id, name: o_output.name || o_output.id });
                });
                if (o_self.a_o_device.length === 0) {
                    o_self.s_error = "No MIDI output devices found.";
                }
            } catch (o_err) {
                o_self.s_error = "MIDI access denied or not supported: " + o_err.message;
            }
        },
        f_select_device: function() {
            let o_self = this;
            if (o_self.s_id__device) {
                let o_dev = o_self.a_o_device.find(function(d) { return d.id === o_self.s_id__device; });
                o_self.s_status = o_dev ? "Selected: " + o_dev.name : "";
            }
        },
        f_load_programs: async function() {
            let o_resp = await f_send_wsmsg_with_response(
                f_o_wsmsg(o_wsmsg__f_v_crud__indb.s_name, ['read', s_name_table])
            );
            o_state[s_name_table] = o_resp.v_result || [];
        },
        f_select_program: function() {
            let o_self = this;
            if (!o_self._o_editor) return;
            if (o_self.n_id__program === null) {
                o_self._o_editor.setValue('');
                return;
            }
            let o_prog = o_state[s_name_table].find(function(o) { return o.n_id === o_self.n_id__program; });
            if (o_prog) {
                o_self._o_editor.setValue(o_prog.s_code || '');
            }
        },
        f_save_program: async function() {
            let o_self = this;
            let s_code = o_self._o_editor ? o_self._o_editor.getValue() : '';

            if (o_self.n_id__program !== null) {
                // update existing
                let o_resp = await f_send_wsmsg_with_response(
                    f_o_wsmsg(o_wsmsg__f_v_crud__indb.s_name, [
                        'update', s_name_table,
                        { n_id: o_self.n_id__program },
                        { s_code: s_code }
                    ])
                );
                if (o_resp.v_result) {
                    let n_idx = o_state[s_name_table].findIndex(function(o) { return o.n_id === o_resp.v_result.n_id; });
                    if (n_idx !== -1) o_state[s_name_table][n_idx] = o_resp.v_result;
                }
                o_self.s_status = "Saved";
            } else {
                // create new — prompt for name
                let s_name = prompt('Program name:');
                if (!s_name) return;
                let o_resp = await f_send_wsmsg_with_response(
                    f_o_wsmsg(o_wsmsg__f_v_crud__indb.s_name, [
                        'create', s_name_table,
                        { s_name: s_name, s_code: s_code }
                    ])
                );
                if (o_resp.v_result) {
                    o_state[s_name_table].push(o_resp.v_result);
                    o_self.n_id__program = o_resp.v_result.n_id;
                }
                o_self.s_status = "Created & saved";
            }
        },
        f_new_program: function() {
            let o_self = this;
            o_self.n_id__program = null;
            if (o_self._o_editor) {
                o_self._o_editor.setValue('');
            }
        },
        f_delete_program: async function() {
            let o_self = this;
            if (o_self.n_id__program === null) return;
            let o_prog = o_state[s_name_table].find(function(o) { return o.n_id === o_self.n_id__program; });
            if (!confirm('Delete program "' + (o_prog ? o_prog.s_name : '') + '"?')) return;
            let o_resp = await f_send_wsmsg_with_response(
                f_o_wsmsg(o_wsmsg__f_v_crud__indb.s_name, [
                    'delete', s_name_table,
                    { n_id: o_self.n_id__program }
                ])
            );
            if (o_resp.v_result) {
                let n_idx = o_state[s_name_table].findIndex(function(o) { return o.n_id === o_self.n_id__program; });
                if (n_idx !== -1) o_state[s_name_table].splice(n_idx, 1);
            }
            o_self.n_id__program = null;
            if (o_self._o_editor) {
                o_self._o_editor.setValue('');
            }
            o_self.s_status = "Deleted";
        },
        f_run: async function() {
            let o_self = this;
            o_self.s_log = "";
            o_self.s_status = "";

            if (!o_self._o_midi_access) {
                o_self.s_error = "No MIDI access. Click Refresh first.";
                return;
            }

            let o_output = o_self._o_midi_access.outputs.get(o_self.s_id__device);
            if (!o_output) {
                o_self.s_error = "Selected device not found. Try refreshing.";
                return;
            }

            let s_code = o_self._o_editor ? o_self._o_editor.getValue() : "";

            // wrap output.send to log messages
            let a_s_log = [];
            let o_proxy = {
                send: function(a_n_data) {
                    let s_hex = Array.from(a_n_data).map(function(n) {
                        return '0x' + n.toString(16).toUpperCase().padStart(2, '0');
                    }).join(' ');
                    a_s_log.push("SEND: [" + s_hex + "]");
                    o_self.s_log = a_s_log.join("\n");
                    o_output.send(a_n_data);
                }
            };

            try {
                let f_user = new (Object.getPrototypeOf(async function(){}).constructor)('output', s_code);
                await f_user(o_proxy);
                o_self.s_status = "Executed OK";
            } catch (o_err) {
                o_self.s_error = "Runtime error: " + o_err.message;
                o_self.s_status = "Error";
            }
        },
    },
    mounted: async function() {
        let o_self = this;

        // request MIDI access on load
        o_self.f_refresh_devices();

        // load programs from DB
        await o_self.f_load_programs();

        // auto-select 'welcome' if it exists
        let o_welcome = o_state[s_name_table].find(function(o) { return o.s_name === 'welcome'; });
        if (o_welcome) {
            o_self.n_id__program = o_welcome.n_id;
        }

        // load Monaco from CDN
        let o_script = document.createElement('script');
        o_script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/loader.js';
        o_script.onload = function() {
            require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs' } });
            require(['vs/editor/editor.main'], function(monaco) {
                let s_initial = '';
                if (o_welcome) {
                    s_initial = o_welcome.s_code || '';
                }
                o_self._o_editor = monaco.editor.create(o_self.$refs.el_editor, {
                    value: s_initial,
                    language: 'javascript',
                    theme: 'vs-dark',
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 12 },
                });

                // Alt+Enter to run
                o_self._o_editor.addAction({
                    id: 'midi-run',
                    label: 'Run MIDI Program',
                    keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.Enter],
                    run: function() { o_self.f_run(); },
                });
            });
        };
        document.head.appendChild(o_script);
    },
    beforeUnmount: function() {
        if (this._o_editor) {
            this._o_editor.dispose();
            this._o_editor = null;
        }
    },
};

export { o_component__midi };
