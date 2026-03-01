// Copyright (C) [2026] [Jonas Immanuel Frey] - Licensed under GPLv2. See LICENSE file for details.

let s_name_prop_ts_created = 'n_ts_ms_created';
let s_name_prop_ts_updated = 'n_ts_ms_updated';
let s_name_prop_id = 'n_id';

let f_s_name_table__from_o_model = function(o_model) {
    return 'a_' + o_model.s_name;
}
let f_s_name_foreign_key__from_o_model = function(o_model) {
    return 'n_' + o_model.s_name + '_' + s_name_prop_id;
}
let f_o_property = function(
    s_name, 
    s_type, 
    f_b_val_valid = function(){return true},
){
    return {
        s_name,
        s_type,
        f_b_val_valid
    }
}
let f_o_model = function({
    s_name,
    a_o_property
}){
    return {
        s_name,
        a_o_property
    }
}
let f_a_s_error__invalid_model_instance = function(
    o_model,
    o_instance
){
    let a_s_error = [];
    // console.log(o_instance)
    for(let o_model_prop of o_model.a_o_property){
        let value = o_instance[o_model_prop.s_name];
        // if the property has a validation function, check if the value is valid
        let b_valid = true;
        if(o_model_prop.f_b_val_valid){
            b_valid = o_model_prop.f_b_val_valid(value);
            if(!b_valid){
                let s_error = `Invalid value for property ${o_model_prop.s_name}: ${value}
                validator function is: ${o_model_prop.f_b_val_valid.toString()}
                got value : ${value} of type ${typeof value}`;
                a_s_error.push(s_error);
            }
        }
    }
    // check if instance has property that is not in model
    for(let s_prop in o_instance){
        let o_model_prop = o_model.a_o_property.find(function(o_prop){
            return o_prop.s_name === s_prop;
        });
        if(!o_model_prop){
            let s_error = `Instance has property ${s_prop} that is not defined in model ${o_model.s_name}`;
            a_s_error.push(s_error);
        }
    }

    return a_s_error;
}
let f_o_model_prop__default_id = function(s_name){
    return f_o_property(s_name, 'number', (n_id)=>{
        // id will be undefined or null if the object does not exist in the database, but it will be set to a number if it does exist in the database
        if (n_id === undefined || n_id === null) return true;
        return Number.isInteger(n_id);
    });
}
let f_o_model_prop__timestamp_default = function(s_name){
    return f_o_property(s_name, 'number', (n_timestamp)=>{
        // created timestamp will be undefined or null if the object does not exist in the database, but it will be set to a number if it does exist in the database
        if (n_timestamp === undefined || n_timestamp === null) return true;
        return Number.isInteger(n_timestamp);
    });
}
let f_o_model__from_s_name_table = function(s_name_table) {
    return a_o_model.find(function(o_model) {
        return f_s_name_table__from_o_model(o_model) === s_name_table;
    });
};

let o_course__math101 = {
    s_name: 'Math 101'
}
let o_course__cs101 = {
    s_name: 'CS 101'
}
let o_student__gretel = {
    s_name: 'Gretel',
    o_course: o_course__cs101
}
let o_student__olaf = {
    s_name: 'Olaf',
    o_course: o_course__math101
}

let a_o_data_default = [
    {o_student: o_student__gretel},
    {o_student: o_student__olaf},
    {
        o_student: {
            s_name: "Daria", 
            o_course: o_course__math101
        }
    },
    {
        o_keyvalpair: {
            s_key: 's_path_absolute__filebrowser',
            s_value: '/home'
        }
    },
    {
        o_program: {
            s_name: 'welcome',
            s_code: [
                '// Launchpad Mini debug: cycle through colors on every pad',
                '// \'output\' is the selected MIDI output device',
                '//',
                '// Velocity = color index (0-127). 0 = off.',
                '',
                '// --- Enter Programmer mode (Launchpad Mini MK3) ---',
                '// This gives direct control over all pads via notes 11-99.',
                '// Without this, the device may be in Session/Drums/Keys mode.',
                'output.send([0xF0, 0x00, 0x20, 0x29, 0x02, 0x0D, 0x0E, 0x01, 0xF7]);',
                '',
                '// --- Helper: light a pad by flat index (0-80) and color (0-127) ---',
                '// Layout: 9x9 grid, bottom-left = note 11, top-right = note 99',
                '//   index 0  = bottom-left  (note 11)',
                '//   index 80 = top-right    (note 99)',
                'function f_light(n_index, n_color) {',
                '    let row = Math.floor(n_index / 9);',
                '    let col = n_index % 9;',
                '    let note = (row + 1) * 10 + (col + 1);',
                '    output.send([0x90, note, n_color]);',
                '}',
                '',
                '// --- Clear all pads ---',
                'function f_clear() {',
                '    for (let i = 0; i < 81; i++) f_light(i, 0);',
                '}',
                '',
                '// --- Debug sweep: cycle colors across all 81 pads ---',
                'let n_delay = 80;',
                'let n_sweep = 0;',
                'let n_sweeps = 10;',
                'let a_n_color = [5, 9, 13, 17, 21, 37, 45, 53, 72, 108];',
                '',
                'function f_sweep() {',
                '    if (n_sweep >= n_sweeps) return;',
                '    let n_c = a_n_color[n_sweep % a_n_color.length];',
                '',
                '    for (let i = 0; i < 81; i++) {',
                '        setTimeout(() => f_light(i, n_c), i * n_delay);',
                '    }',
                '',
                '    // after all pads lit, pause, clear, next sweep',
                '    setTimeout(() => {',
                '        f_clear();',
                '        n_sweep++;',
                '        setTimeout(f_sweep, 300);',
                '    }, 81 * n_delay + 500);',
                '}',
                '',
                'f_sweep();',
            ].join('\n')
        }
    },
    {
        o_program: {
            s_name: 'fragment_shader',
            s_code: [
                '// Fragment shader for Launchpad',
                '// Write f_fragment(col, row, t) and return a color (0-127).',
                '// col: 0-8, row: 0-8, t: elapsed seconds',
                '// The render loop calls it for every pad at ~15 fps.',
                '',
                '// --- Enter Programmer mode (Launchpad Mini MK3) ---',
                'output.send([0xF0, 0x00, 0x20, 0x29, 0x02, 0x0D, 0x0E, 0x01, 0xF7]);',
                '',
                'function f_light(n_index, n_color) {',
                '    let row = Math.floor(n_index / 9);',
                '    let col = n_index % 9;',
                '    let note = (row + 1) * 10 + (col + 1);',
                '    output.send([0x90, note, n_color]);',
                '}',
                '',
                'function f_clear() {',
                '    for (let i = 0; i < 81; i++) f_light(i, 0);',
                '}',
                '',
                '// --- Heart SDF (iq) ported to JS ---',
                'function f_sd_heart(px, py) {',
                '    px = Math.abs(px);',
                '    if (py + px > 1.0) {',
                '        let dx = px - 0.25, dy = py - 0.75;',
                '        return Math.sqrt(dx*dx + dy*dy) - Math.SQRT2 / 4.0;',
                '    }',
                '    let dx1 = px, dy1 = py - 1.0;',
                '    let d1 = dx1*dx1 + dy1*dy1;',
                '    let s = Math.max(px + py, 0.0) * 0.5;',
                '    let dx2 = px - s, dy2 = py - s;',
                '    let d2 = dx2*dx2 + dy2*dy2;',
                '    return Math.sqrt(Math.min(d1, d2)) * Math.sign(px - py);',
                '}',
                '',
                '// --- Your fragment shader --- edit this! ---',
                'function f_fragment(col, row, t) {',
                '    // map grid to -1..1 centered coords',
                '    let px = (col - 4) / 4;',
                '    let py = -(row - 4.5) / 4;',
                '    let d = f_sd_heart(px, py);',
                '    // pulsing heart: animate the threshold',
                '    let pulse = 0.05 * Math.sin(t * 6);',
                '    if (d < pulse) {',
                '        // inside heart — hot color (red range ~5..72)',
                '        let glow = 1.0 - Math.max(0, d / -0.5);',
                '        return Math.floor(5 + glow * 67);',
                '    }',
                '    // outside — off',
                '    return 0;',
                '}',
                '',
                '// --- Render loop ---',
                'let n_fps = 15;',
                'let n_duration = 15; // seconds',
                'let n_t0 = Date.now();',
                '',
                'let n_interval = setInterval(() => {',
                '    let t = (Date.now() - n_t0) / 1000;',
                '    if (t > n_duration) {',
                '        clearInterval(n_interval);',
                '        f_clear();',
                '        return;',
                '    }',
                '    for (let row = 0; row < 9; row++) {',
                '        for (let col = 0; col < 9; col++) {',
                '            let c = f_fragment(col, row, t);',
                '            c = Math.max(0, Math.min(127, Math.floor(c)));',
                '            f_light(row * 9 + col, c);',
                '        }',
                '    }',
                '}, 1000 / n_fps);',
            ].join('\n')
        }
    }
]


let f_o_model_instance = function(
    o_model, 
    o_data
){
    // check if the data is valid for the model properties
    let a_s_error = f_a_s_error__invalid_model_instance(o_model, o_data);
    if(a_s_error.length > 0){
        throw new Error('Invalid model instance: ' + a_s_error.join('; '));
    }
    return o_data;
}
let o_model__o_student = f_o_model({
    s_name: 'o_student',
    a_o_property: [
        f_o_model_prop__default_id(s_name_prop_id),
        f_o_property('s_name', 'string', (s)=>{return s!==''}),
        f_o_model_prop__timestamp_default(s_name_prop_ts_created),
        f_o_model_prop__timestamp_default(s_name_prop_ts_updated),
    ]
})

let o_model__o_course = f_o_model({
    s_name: 'o_course',
    a_o_property: [
        f_o_model_prop__default_id(s_name_prop_id),
        f_o_property('s_name', 'string', (s)=>{return s!==''}),
        f_o_model_prop__timestamp_default(s_name_prop_ts_created),
        f_o_model_prop__timestamp_default(s_name_prop_ts_updated),
    ]
})

let o_model__o_course_o_student = f_o_model({
    s_name: 'o_course_o_student', //'enrolment' table to link students and courses in a many-to-many relationship
    a_o_property: [
        f_o_model_prop__default_id(s_name_prop_id),
        f_o_model_prop__default_id(f_s_name_foreign_key__from_o_model(o_model__o_course)),
        f_o_model_prop__default_id(f_s_name_foreign_key__from_o_model(o_model__o_student)),
        f_o_model_prop__timestamp_default(s_name_prop_ts_created),
        f_o_model_prop__timestamp_default(s_name_prop_ts_updated),
    ]
})
let o_model__o_wsclient = f_o_model({
    s_name: 'o_wsclient',
    a_o_property: [
        f_o_model_prop__default_id(s_name_prop_id),
        f_o_property('s_ip', 'string', (s)=>{return s!==''}),
        f_o_model_prop__timestamp_default(s_name_prop_ts_created),
        f_o_model_prop__timestamp_default(s_name_prop_ts_updated),
    ]
})
let o_model__o_fsnode = f_o_model({
    s_name: 'o_fsnode',
    a_o_property: [
        f_o_model_prop__default_id(s_name_prop_id),
        f_o_model_prop__default_id('n_o_fsnode_n_id'),
        f_o_property('n_bytes', 'number'),
        f_o_property('s_name', 'string', (s)=>{return s!==''}),
        f_o_property('s_path_absolute', 'string', (s)=>{return s!==''}),
        f_o_property('b_folder', 'boolean', (b)=>{return typeof b === 'boolean'}),
        f_o_property('b_image', 'boolean'),
        f_o_property('b_video', 'boolean'),
        f_o_model_prop__timestamp_default(s_name_prop_ts_created),
        f_o_model_prop__timestamp_default(s_name_prop_ts_updated),
    ]
});
let o_model__o_keyvalpair = f_o_model({
    // a generic key-value pair model that ca be used for
    // config data 
    // temporary data storage
    s_name: 'o_keyvalpair',
    a_o_property: [
        f_o_model_prop__default_id('n_id'),
        f_o_property('s_key', 'string', (s)=>{return s!==''}),
        f_o_property('s_value', 'string', (s)=>{return s!==''}),
        f_o_model_prop__timestamp_default(s_name_prop_ts_created),
        f_o_model_prop__timestamp_default(s_name_prop_ts_updated),
    ]
});

let o_model__o_utterance = f_o_model({
    s_name: 'o_utterance',
    a_o_property: [
        f_o_model_prop__default_id('n_id'),
        f_o_property('s_text', 'string', (s)=>{return s!==''}),
        f_o_model_prop__timestamp_default(s_name_prop_ts_created),
        f_o_model_prop__default_id(f_s_name_foreign_key__from_o_model(o_model__o_fsnode)),
        f_o_model_prop__timestamp_default(s_name_prop_ts_updated),
    ]
});

let o_model__o_program = f_o_model({
    s_name: 'o_program',
    a_o_property: [
        f_o_model_prop__default_id('n_id'),
        f_o_property('s_name', 'string', (s)=>{return s!==''}),
        f_o_property('s_code', 'string'),
        f_o_model_prop__timestamp_default(s_name_prop_ts_created),
        f_o_model_prop__timestamp_default(s_name_prop_ts_updated),
    ]
});

let f_o_example_instance_connected_cricular_from_o_model = function(o_model, a_s_name__visited = []){
    let o = {};
    // fill own property with example value based on type
    for(let o_property of o_model.a_o_property){
        if(o_property.s_type === 'string'){
            o[o_property.s_name] = 'string';
        } else if(o_property.s_type === 'number'){
            let b_timestamp = (
                o_property.s_name === s_name_prop_ts_created
                || o_property.s_name === s_name_prop_ts_updated
            );
            o[o_property.s_name] = b_timestamp ? Date.now() : 1;
        } else if(o_property.s_type === 'boolean'){
            o[o_property.s_name] = true;
        }
    }

    a_s_name__visited = [...a_s_name__visited, o_model.s_name];

    let s_fk__self = f_s_name_foreign_key__from_o_model(o_model);

    for(let o_model__candidate of a_o_model){
        // find foreign key property in candidate model (excluding the primary n_id)
        let a_o_prop__fk = o_model__candidate.a_o_property.filter(function(o_prop){
            return o_prop.s_name !== s_name_prop_id
                && o_prop.s_name.startsWith('n_')
                && o_prop.s_name.endsWith(`_${s_name_prop_id}`);
        });

        let b_references_self = a_o_prop__fk.some(function(o_prop){
            return o_prop.s_name === s_fk__self;
        });

        if(!b_references_self) continue;

        let b_junction = a_o_prop__fk.length >= 2;

        if(b_junction){
            // junction table: find connected model on the other side
            for(let o_prop__fk of a_o_prop__fk){
                if(o_prop__fk.s_name === s_fk__self) continue;

                let o_model__connected = a_o_model.find(function(o_m){
                    return f_s_name_foreign_key__from_o_model(o_m) === o_prop__fk.s_name;
                });

                if(!o_model__connected) continue;

                let s_key = f_s_name_table__from_o_model(o_model__connected)

                if(a_s_name__visited.includes(o_model__connected.s_name)){
                    o[s_key] = ['...'];
                } else {
                    o[s_key] = [
                        f_o_example_instance_connected_cricular_from_o_model(
                            o_model__connected, a_s_name__visited
                        )
                    ];
                }
            }
        } else {
            // direct foreign key: candidate "belongs to" this model, nest as has-many
            let s_key = f_s_name_table__from_o_model(o_model__candidate);

            if(a_s_name__visited.includes(o_model__candidate.s_name)){
                o[s_key] = ['...'];
            } else {
                o[s_key] = [
                    f_o_example_instance_connected_cricular_from_o_model(
                        o_model__candidate, a_s_name__visited
                    )
                ];
            }
        }
    }

    return o;
}




let s_o_logmsg_s_type__log = 'log';
let s_o_logmsg_s_type__error = 'error';
let s_o_logmsg_s_type__warn = 'warn';
let s_o_logmsg_s_type__info = 'info';
let s_o_logmsg_s_type__debug = 'debug';
let s_o_logmsg_s_type__table = 'table';

let f_o_logmsg = function(
    s_message, 
    b_consolelog = true,
    b_guilog = false,
    s_type, 
    n_ts_ms_created,
    n_ttl_ms
){
    return {
        s_message, 
        b_consolelog,
        b_guilog,
        s_type, 
        n_ts_ms_created,
        n_ttl_ms
    }
}


let a_o_model = [
    o_model__o_student,
    o_model__o_course,
    o_model__o_course_o_student,
    o_model__o_wsclient,
    o_model__o_fsnode,
    o_model__o_keyvalpair,
    o_model__o_utterance,
    o_model__o_program
];

// definition factory — creates message type templates for the a_o_wsmsg registry
let f_o_wsmsg_def = function(
    s_name,
    b_expecting_response = false
){
    return {
        s_name,
        b_expecting_response,
        f_v_client_implementation: null,
        f_v_server_implementation: null
    }
}

// instance factory — creates actual messages to send over the wire
let f_o_wsmsg = function(
    s_name,
    v_data
){
    return {
        s_name,
        v_data,
        s_uuid: crypto.randomUUID()
    }
}

// message type definitions
let o_wsmsg__deno_copy_file = f_o_wsmsg_def('deno_copy_file', false);
let o_wsmsg__deno_stat = f_o_wsmsg_def('deno_stat', false);
let o_wsmsg__deno_mkdir = f_o_wsmsg_def('deno_mkdir', false);
let o_wsmsg__f_v_crud__indb = f_o_wsmsg_def('f_v_crud__indb', true);
let o_wsmsg__f_delete_table_data = f_o_wsmsg_def('f_delete_table_data', true);
let o_wsmsg__f_a_o_fsnode = f_o_wsmsg_def('f_a_o_fsnode', true);
let o_wsmsg__logmsg = f_o_wsmsg_def('logmsg', false);
let o_wsmsg__set_state_data = f_o_wsmsg_def('set_state_data', false);
let o_wsmsg__utterance = f_o_wsmsg_def('utterance', false);

// client implementations
o_wsmsg__logmsg.f_v_client_implementation = function(o_wsmsg, o_wsmsg__existing, o_state){
    let o_logmsg = o_wsmsg.v_data;
    if(o_logmsg.b_consolelog){
        console[o_logmsg.s_type](o_logmsg.s_message);
    }
    if(o_logmsg.b_guilog){
        o_logmsg.n_ts_ms_created = o_logmsg.n_ts_ms_created || Date.now();
        o_logmsg.n_ttl_ms = o_logmsg.n_ttl_ms || 5000;
        o_state.a_o_toast.push(o_logmsg);
    }
}
o_wsmsg__set_state_data.f_v_client_implementation = function(o_wsmsg, o_wsmsg__existing, o_state){
    o_state[o_wsmsg.v_data.s_property] = o_wsmsg.v_data.value;
}
o_wsmsg__utterance.f_v_client_implementation = function(o_wsmsg, o_wsmsg__existing, o_state){
    if(o_state.b_utterance_muted) return;
    let v_data = o_wsmsg.v_data;
    if(!v_data || !v_data.o_fsnode || !v_data.o_fsnode.s_path_absolute) return;
    let s_url = '/api/file?path=' + encodeURIComponent(v_data.o_fsnode.s_path_absolute);
    let o_audio = new Audio(s_url);
    o_audio.play().catch(function(o_error){
        console.warn('utterance audio playback failed (user interaction may be required):', o_error.message);
    });
}

let a_o_wsmsg = [
    o_wsmsg__deno_copy_file,
    o_wsmsg__deno_stat,
    o_wsmsg__deno_mkdir,
    o_wsmsg__f_v_crud__indb,
    o_wsmsg__f_delete_table_data,
    o_wsmsg__f_a_o_fsnode,
    o_wsmsg__logmsg,
    o_wsmsg__set_state_data,
    o_wsmsg__utterance,
]

export {
    o_model__o_student,
    o_model__o_course,
    o_model__o_course_o_student,
    o_model__o_wsclient,
    o_model__o_fsnode,
    o_model__o_keyvalpair,
    o_model__o_utterance,
    o_model__o_program,
    a_o_model,
    f_o_property,
    f_o_model,
    f_o_model_prop__default_id,
    f_o_model_prop__timestamp_default,
    f_s_name_table__from_o_model,
    f_s_name_foreign_key__from_o_model,
    f_o_model_instance,
    f_o_model__from_s_name_table,
    s_name_prop_ts_created,
    s_name_prop_ts_updated,
    f_a_s_error__invalid_model_instance,
    s_name_prop_id,
    f_o_logmsg,
    a_o_wsmsg,
    o_wsmsg__deno_copy_file,
    o_wsmsg__deno_stat,
    o_wsmsg__deno_mkdir,
    o_wsmsg__f_v_crud__indb,
    o_wsmsg__set_state_data,
    o_wsmsg__f_delete_table_data,
    o_wsmsg__f_a_o_fsnode,
    o_wsmsg__logmsg,
    o_wsmsg__utterance,
    f_o_wsmsg,
    f_o_wsmsg_def,
    s_o_logmsg_s_type__log,
    s_o_logmsg_s_type__error,
    s_o_logmsg_s_type__warn,
    s_o_logmsg_s_type__info,
    s_o_logmsg_s_type__debug,
    s_o_logmsg_s_type__table,
    a_o_data_default,
    f_o_example_instance_connected_cricular_from_o_model
}