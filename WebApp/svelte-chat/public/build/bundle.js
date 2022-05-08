
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function localStorageStore({ storageKey, initialValue = "" }) {
      const init = localStorage.getItem(storageKey) || initialValue;

      const { subscribe, update, set } = writable(init);

      subscribe((state) => {
        if (state) localStorage.setItem(storageKey, state);
      });

      return {
        subscribe,
        update,
        set,
      };
    }

    const nav = localStorageStore({
      storageKey: "chat_nav",
      initialValue: "messages",
    });

    const chatTopic = localStorageStore({
      storageKey: "chat_topic",
      initialValue: "gundb",
    });

    const user = localStorageStore({ storageKey: "chat_user" });

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    function commonjsRequire (target) {
    	throw new Error('Could not dynamically require "' + target + '". Please configure the dynamicRequireTargets option of @rollup/plugin-commonjs appropriately for this require call to behave properly.');
    }

    var gun$1 = createCommonjsModule(function (module) {
    (function(){

      /* UNBUILD */
      function USE(arg, req){
        return req? commonjsRequire(arg) : arg.slice? USE[R(arg)] : function(mod, path){
          arg(mod = {exports: {}});
          USE[R(path)] = mod.exports;
        }
        function R(p){
          return p.split('/').slice(-1).toString().replace('.js','');
        }
      }
      { var MODULE = module; }
    USE(function(module){
    		// Shim for generic javascript utilities.
    		String.random = function(l, c){
    			var s = '';
    			l = l || 24; // you are not going to make a 0 length random number, so no need to check type
    			c = c || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXZabcdefghijklmnopqrstuvwxyz';
    			while(l-- > 0){ s += c.charAt(Math.floor(Math.random() * c.length)); }
    			return s;
    		};
    		String.match = function(t, o){ var tmp, u;
    			if('string' !== typeof t){ return false }
    			if('string' == typeof o){ o = {'=': o}; }
    			o = o || {};
    			tmp = (o['='] || o['*'] || o['>'] || o['<']);
    			if(t === tmp){ return true }
    			if(u !== o['=']){ return false }
    			tmp = (o['*'] || o['>']);
    			if(t.slice(0, (tmp||'').length) === tmp){ return true }
    			if(u !== o['*']){ return false }
    			if(u !== o['>'] && u !== o['<']){
    				return (t >= o['>'] && t <= o['<'])? true : false;
    			}
    			if(u !== o['>'] && t >= o['>']){ return true }
    			if(u !== o['<'] && t <= o['<']){ return true }
    			return false;
    		};
    		String.hash = function(s, c){ // via SO
    			if(typeof s !== 'string'){ return }
    	    c = c || 0; // CPU schedule hashing by
    	    if(!s.length){ return c }
    	    for(var i=0,l=s.length,n; i<l; ++i){
    	      n = s.charCodeAt(i);
    	      c = ((c<<5)-c)+n;
    	      c |= 0;
    	    }
    	    return c;
    	  };
    		var has = Object.prototype.hasOwnProperty;
    		Object.plain = function(o){ return o? (o instanceof Object && o.constructor === Object) || Object.prototype.toString.call(o).match(/^\[object (\w+)\]$/)[1] === 'Object' : false };
    		Object.empty = function(o, n){
    			for(var k in o){ if(has.call(o, k) && (!n || -1==n.indexOf(k))){ return false } }
    			return true;
    		};
    		Object.keys = Object.keys || function(o){
    			var l = [];
    			for(var k in o){ if(has.call(o, k)){ l.push(k); } }
    			return l;
    		}
    		;(function(){ // max ~1ms or before stack overflow 
    			var u, sT = setTimeout, l = 0, c = 0, sI = (typeof setImmediate !== ''+u && setImmediate) || sT; // queueMicrotask faster but blocks UI
    			sT.hold = sT.hold || 9;
    			sT.poll = sT.poll || function(f){ //f(); return; // for testing
    				if((sT.hold >= (+new Date - l)) && c++ < 3333){ f(); return }
    				sI(function(){ l = +new Date; f(); },c=0);
    			};
    		}());
    (function(){ // Too many polls block, this "threads" them in turns over a single thread in time.
    			var sT = setTimeout, t = sT.turn = sT.turn || function(f){ 1 == s.push(f) && p(T); }
    			, s = t.s = [], p = sT.poll, i = 0, f, T = function(){
    				if(f = s[i++]){ f(); }
    				if(i == s.length || 99 == i){
    					s = t.s = s.slice(i);
    					i = 0;
    				}
    				if(s.length){ p(T); }
    			};
    		}());
    (function(){
    			var u, sT = setTimeout, T = sT.turn;
    			(sT.each = sT.each || function(l,f,e,S){ S = S || 9; (function t(s,L,r){
    			  if(L = (s = (l||[]).splice(0,S)).length){
    			  	for(var i = 0; i < L; i++){
    			  		if(u !== (r = f(s[i]))){ break }
    			  	}
    			  	if(u === r){ T(t); return }
    			  } e && e(r);
    			}());})();
    		}());
    	})(USE, './shim');
    USE(function(module){
    		// On event emitter generic javascript utility.
    		module.exports = function onto(tag, arg, as){
    			if(!tag){ return {to: onto} }
    			var u, f = 'function' == typeof arg, tag = (this.tag || (this.tag = {}))[tag] || f && (
    				this.tag[tag] = {tag: tag, to: onto._ = { next: function(arg){ var tmp;
    					if(tmp = this.to){ tmp.next(arg); }
    			}}});
    			if(f){
    				var be = {
    					off: onto.off ||
    					(onto.off = function(){
    						if(this.next === onto._.next){ return !0 }
    						if(this === this.the.last){
    							this.the.last = this.back;
    						}
    						this.to.back = this.back;
    						this.next = onto._.next;
    						this.back.to = this.to;
    						if(this.the.last === this.the){
    							delete this.on.tag[this.the.tag];
    						}
    					}),
    					to: onto._,
    					next: arg,
    					the: tag,
    					on: this,
    					as: as,
    				};
    				(be.back = tag.last || tag).to = be;
    				return tag.last = be;
    			}
    			if((tag = tag.to) && u !== arg){ tag.next(arg); }
    			return tag;
    		};
    	})(USE, './onto');
    USE(function(module){
    		// Valid values are a subset of JSON: null, binary, number (!Infinity), text,
    		// or a soul relation. Arrays need special algorithms to handle concurrency,
    		// so they are not supported directly. Use an extension that supports them if
    		// needed but research their problems first.
    		module.exports = function (v) {
    		  // "deletes", nulling out keys.
    		  return v === null ||
    			"string" === typeof v ||
    			"boolean" === typeof v ||
    			// we want +/- Infinity to be, but JSON does not support it, sad face.
    			// can you guess what v === v checks for? ;)
    			("number" === typeof v && v != Infinity && v != -Infinity && v === v) ||
    			(!!v && "string" == typeof v["#"] && Object.keys(v).length === 1 && v["#"]);
    		};
    	})(USE, './valid');
    USE(function(module){
    		USE('./shim');
    		function State(){
    			var t = +new Date;
    			if(last < t){
    				return N = 0, last = t + State.drift;
    			}
    			return last = t + ((N += 1) / D) + State.drift;
    		}
    		State.drift = 0;
    		var NI = -Infinity, N = 0, D = 999, last = NI, u; // WARNING! In the future, on machines that are D times faster than 2016AD machines, you will want to increase D by another several orders of magnitude so the processing speed never out paces the decimal resolution (increasing an integer effects the state accuracy).
    		State.is = function(n, k, o){ // convenience function to get the state on a key on a node and return it.
    			var tmp = (k && n && n._ && n._['>']) || o;
    			if(!tmp){ return }
    			return ('number' == typeof (tmp = tmp[k]))? tmp : NI;
    		};
    		State.ify = function(n, k, s, v, soul){ // put a key's state on a node.
    			(n = n || {})._ = n._ || {}; // safety check or init.
    			if(soul){ n._['#'] = soul; } // set a soul if specified.
    			var tmp = n._['>'] || (n._['>'] = {}); // grab the states data.
    			if(u !== k && k !== '_'){
    				if('number' == typeof s){ tmp[k] = s; } // add the valid state.
    				if(u !== v){ n[k] = v; } // Note: Not its job to check for valid values!
    			}
    			return n;
    		};
    		module.exports = State;
    	})(USE, './state');
    USE(function(module){
    		USE('./shim');
    		function Dup(opt){
    			var dup = {s:{}}, s = dup.s;
    			opt = opt || {max: 999, age: 1000 * 9};//*/ 1000 * 9 * 3};
    			dup.check = function(id){
    				if(!s[id]){ return false }
    				return dt(id);
    			};
    			var dt = dup.track = function(id){
    				var it = s[id] || (s[id] = {});
    				it.was = dup.now = +new Date;
    				if(!dup.to){ dup.to = setTimeout(dup.drop, opt.age + 9); }
    				return it;
    			};
    			dup.drop = function(age){
    				dup.to = null;
    				dup.now = +new Date;
    				var l = Object.keys(s);
    				console.STAT && console.STAT(dup.now, +new Date - dup.now, 'dup drop keys'); // prev ~20% CPU 7% RAM 300MB // now ~25% CPU 7% RAM 500MB
    				setTimeout.each(l, function(id){ var it = s[id]; // TODO: .keys( is slow?
    					if(it && (age || opt.age) > (dup.now - it.was)){ return }
    					delete s[id];
    				},0,99);
    			};
    			return dup;
    		}
    		module.exports = Dup;
    	})(USE, './dup');
    USE(function(module){
    		// request / response module, for asking and acking messages.
    		USE('./onto'); // depends upon onto!
    		module.exports = function ask(cb, as){
    			if(!this.on){ return }
    			var lack = (this.opt||{}).lack || 9000;
    			if(!('function' == typeof cb)){
    				if(!cb){ return }
    				var id = cb['#'] || cb, tmp = (this.tag||'')[id];
    				if(!tmp){ return }
    				if(as){
    					tmp = this.on(id, as);
    					clearTimeout(tmp.err);
    					tmp.err = setTimeout(function(){ tmp.off(); }, lack);
    				}
    				return true;
    			}
    			var id = (as && as['#']) || random(9);
    			if(!cb){ return id }
    			var to = this.on(id, cb, as);
    			to.err = to.err || setTimeout(function(){ to.off();
    				to.next({err: "Error: No ACK yet.", lack: true});
    			}, lack);
    			return id;
    		};
    		var random = String.random || function(){ return Math.random().toString(36).slice(2) };
    	})(USE, './ask');
    USE(function(module){

    		function Gun(o){
    			if(o instanceof Gun){ return (this._ = {$: this}).$ }
    			if(!(this instanceof Gun)){ return new Gun(o) }
    			return Gun.create(this._ = {$: this, opt: o});
    		}

    		Gun.is = function($){ return ($ instanceof Gun) || ($ && $._ && ($ === $._.$)) || false };

    		Gun.version = 0.2020;

    		Gun.chain = Gun.prototype;
    		Gun.chain.toJSON = function(){};

    		USE('./shim');
    		Gun.valid = USE('./valid');
    		Gun.state = USE('./state');
    		Gun.on = USE('./onto');
    		Gun.dup = USE('./dup');
    		Gun.ask = USE('./ask');
    (function(){
    			Gun.create = function(at){
    				at.root = at.root || at;
    				at.graph = at.graph || {};
    				at.on = at.on || Gun.on;
    				at.ask = at.ask || Gun.ask;
    				at.dup = at.dup || Gun.dup();
    				var gun = at.$.opt(at.opt);
    				if(!at.once){
    					at.on('in', universe, at);
    					at.on('out', universe, at);
    					at.on('put', map, at);
    					Gun.on('create', at);
    					at.on('create', at);
    				}
    				at.once = 1;
    				return gun;
    			};
    			function universe(msg){
    				// TODO: BUG! msg.out = null being set!
    				//if(!F){ var eve = this; setTimeout(function(){ universe.call(eve, msg,1) },Math.random() * 100);return; } // ADD F TO PARAMS!
    				if(!msg){ return }
    				if(msg.out === universe){ this.to.next(msg); return }
    				var eve = this, as = eve.as, at = as.at || as, gun = at.$, dup = at.dup, tmp, DBG = msg.DBG;
    				(tmp = msg['#']) || (tmp = msg['#'] = text_rand(9));
    				if(dup.check(tmp)){ return } dup.track(tmp);
    				tmp = msg._; msg._ = ('function' == typeof tmp)? tmp : function(){};
    				(msg.$ && (msg.$ === (msg.$._||'').$)) || (msg.$ = gun);
    				if(msg['@'] && !msg.put){ ack(msg); }
    				if(!at.ask(msg['@'], msg)){ // is this machine listening for an ack?
    					DBG && (DBG.u = +new Date);
    					if(msg.put){ put(msg); return } else
    					if(msg.get){ Gun.on.get(msg, gun); }
    				}
    				DBG && (DBG.uc = +new Date);
    				eve.to.next(msg);
    				DBG && (DBG.ua = +new Date);
    				if(msg.nts || msg.NTS){ return } // TODO: This shouldn't be in core, but fast way to prevent NTS spread. Delete this line after all peers have upgraded to newer versions.
    				msg.out = universe; at.on('out', msg);
    				DBG && (DBG.ue = +new Date);
    			}
    			function put(msg){
    				if(!msg){ return }
    				var ctx = msg._||'', root = ctx.root = ((ctx.$ = msg.$||'')._||'').root;
    				if(msg['@'] && ctx.faith && !ctx.miss){ // TODO: AXE may split/route based on 'put' what should we do here? Detect @ in AXE? I think we don't have to worry, as DAM will route it on @.
    					msg.out = universe;
    					root.on('out', msg);
    					return;
    				}
    				ctx.latch = root.hatch; ctx.match = root.hatch = [];
    				var put = msg.put;
    				var DBG = ctx.DBG = msg.DBG, S = +new Date; CT = CT || S;
    				if(put['#'] && put['.']){ /*root && root.on('put', msg);*/ return } // TODO: BUG! This needs to call HAM instead.
    				DBG && (DBG.p = S);
    				ctx['#'] = msg['#'];
    				ctx.msg = msg;
    				ctx.all = 0;
    				ctx.stun = 1;
    				var nl = Object.keys(put);//.sort(); // TODO: This is unbounded operation, large graphs will be slower. Write our own CPU scheduled sort? Or somehow do it in below? Keys itself is not O(1) either, create ES5 shim over ?weak map? or custom which is constant.
    				console.STAT && console.STAT(S, ((DBG||ctx).pk = +new Date) - S, 'put sort');
    				var ni = 0, nj, kl, soul, node, states, err, tmp;
    				(function pop(o){
    					if(nj != ni){ nj = ni;
    						if(!(soul = nl[ni])){
    							console.STAT && console.STAT(S, ((DBG||ctx).pd = +new Date) - S, 'put');
    							fire(ctx);
    							return;
    						}
    						if(!(node = put[soul])){ err = ERR+cut(soul)+"no node."; } else
    						if(!(tmp = node._)){ err = ERR+cut(soul)+"no meta."; } else
    						if(soul !== tmp['#']){ err = ERR+cut(soul)+"soul not same."; } else
    						if(!(states = tmp['>'])){ err = ERR+cut(soul)+"no state."; }
    						kl = Object.keys(node||{}); // TODO: .keys( is slow
    					}
    					if(err){
    						msg.err = ctx.err = err; // invalid data should error and stun the message.
    						fire(ctx);
    						//console.log("handle error!", err) // handle!
    						return;
    					}
    					var i = 0, key; o = o || 0;
    					while(o++ < 9 && (key = kl[i++])){
    						if('_' === key){ continue }
    						var val = node[key], state = states[key];
    						if(u === state){ err = ERR+cut(key)+"on"+cut(soul)+"no state."; break }
    						if(!valid(val)){ err = ERR+cut(key)+"on"+cut(soul)+"bad "+(typeof val)+cut(val); break }
    						//ctx.all++; //ctx.ack[soul+key] = '';
    						ham(val, key, soul, state, msg);
    						++C; // courtesy count;
    					}
    					if((kl = kl.slice(i)).length){ turn(pop); return }
    					++ni; kl = null; pop(o);
    				}());
    			} Gun.on.put = put;
    			// TODO: MARK!!! clock below, reconnect sync, SEA certify wire merge, User.auth taking multiple times, // msg put, put, say ack, hear loop...
    			// WASIS BUG! local peer not ack. .off other people: .open
    			function ham(val, key, soul, state, msg){
    				var ctx = msg._||'', root = ctx.root, graph = root.graph, tmp;
    				var vertex = graph[soul] || empty, was = state_is(vertex, key, 1), known = vertex[key];
    				
    				var DBG = ctx.DBG; if(tmp = console.STAT){ if(!graph[soul] || !known){ tmp.has = (tmp.has || 0) + 1; } }

    				var now = State();
    				if(state > now){
    					setTimeout(function(){ ham(val, key, soul, state, msg); }, (tmp = state - now) > MD? MD : tmp); // Max Defer 32bit. :(
    					console.STAT && console.STAT(((DBG||ctx).Hf = +new Date), tmp, 'future');
    					return;
    				}
    				if(state < was){ /*old;*/ if(!ctx.miss){ return } } // but some chains have a cache miss that need to re-fire. // TODO: Improve in future. // for AXE this would reduce rebroadcast, but GUN does it on message forwarding.
    				if(!ctx.faith){ // TODO: BUG? Can this be used for cache miss as well? // Yes this was a bug, need to check cache miss for RAD tests, but should we care about the faith check now? Probably not.
    					if(state === was && (val === known || L(val) <= L(known))){ /*console.log("same");*/ /*same;*/ if(!ctx.miss){ return } } // same
    				}
    				ctx.stun++; // TODO: 'forget' feature in SEA tied to this, bad approach, but hacked in for now. Any changes here must update there.
    				var aid = msg['#']+ctx.all++, id = {toString: function(){ return aid }, _: ctx}; id.toJSON = id.toString; // this *trick* makes it compatible between old & new versions.
    				DBG && (DBG.ph = DBG.ph || +new Date);
    				root.on('put', {'#': id, '@': msg['@'], put: {'#': soul, '.': key, ':': val, '>': state}, _: ctx});
    			}
    			function map(msg){
    				var DBG; if(DBG = (msg._||'').DBG){ DBG.pa = +new Date; DBG.pm = DBG.pm || +new Date;}
          	var eve = this, root = eve.as, graph = root.graph, ctx = msg._, put = msg.put, soul = put['#'], key = put['.'], val = put[':'], state = put['>']; msg['#']; var tmp;
          	if((tmp = ctx.msg) && (tmp = tmp.put) && (tmp = tmp[soul])){ state_ify(tmp, key, state, val, soul); } // necessary! or else out messages do not get SEA transforms.
    				graph[soul] = state_ify(graph[soul], key, state, val, soul);
    				if(tmp = (root.next||'')[soul]){ tmp.on('in', msg); }
    				fire(ctx);
    				eve.to.next(msg);
    			}
    			function fire(ctx, msg){ var root;
    				if(ctx.stop){ return }
    				if(!ctx.err && 0 < --ctx.stun){ return } // TODO: 'forget' feature in SEA tied to this, bad approach, but hacked in for now. Any changes here must update there.
    				ctx.stop = 1;
    				if(!(root = ctx.root)){ return }
    				var tmp = ctx.match; tmp.end = 1;
    				if(tmp === root.hatch){ if(!(tmp = ctx.latch) || tmp.end){ delete root.hatch; } else { root.hatch = tmp; } }
    				ctx.hatch && ctx.hatch(); // TODO: rename/rework how put & this interact.
    				setTimeout.each(ctx.match, function(cb){cb && cb();}); 
    				if(!(msg = ctx.msg) || ctx.err || msg.err){ return }
    				msg.out = universe;
    				ctx.root.on('out', msg);

    				CF(); // courtesy check;
    			}
    			function ack(msg){ // aggregate ACKs.
    				var id = msg['@'] || '', ctx;
    				if(!(ctx = id._)){ return }
    				ctx.acks = (ctx.acks||0) + 1;
    				if(ctx.err = msg.err){
    					msg['@'] = ctx['#'];
    					fire(ctx); // TODO: BUG? How it skips/stops propagation of msg if any 1 item is error, this would assume a whole batch/resync has same malicious intent.
    				}
    				if(!ctx.stop && !ctx.crack){ ctx.crack = ctx.match && ctx.match.push(function(){back(ctx);}); } // handle synchronous acks
    				back(ctx);
    			}
    			function back(ctx){
    				if(!ctx || !ctx.root){ return }
    				if(ctx.stun || ctx.acks !== ctx.all){ return }
    				ctx.root.on('in', {'@': ctx['#'], err: ctx.err, ok: ctx.err? u : {'':1}});
    			}

    			var ERR = "Error: Invalid graph!";
    			var cut = function(s){ return " '"+(''+s).slice(0,9)+"...' " };
    			var L = JSON.stringify, MD = 2147483647, State = Gun.state;
    			var C = 0, CT, CF = function(){if(C>999 && (C/-(CT - (CT = +new Date))>1)){Gun.window && console.log("Warning: You're syncing 1K+ records a second, faster than DOM can update - consider limiting query.");CF=function(){C=0;};}};

    		}());
    (function(){
    			Gun.on.get = function(msg, gun){
    				var root = gun._, get = msg.get, soul = get['#'], node = root.graph[soul], has = get['.'];
    				var next = root.next || (root.next = {}); next[soul];
    				// queue concurrent GETs?
    				// TODO: consider tagging original message into dup for DAM.
    				// TODO: ^ above? In chat app, 12 messages resulted in same peer asking for `#user.pub` 12 times. (same with #user GET too, yipes!) // DAM note: This also resulted in 12 replies from 1 peer which all had same ##hash but none of them deduped because each get was different.
    				// TODO: Moving quick hacks fixing these things to axe for now.
    				// TODO: a lot of GET #foo then GET #foo."" happening, why?
    				// TODO: DAM's ## hash check, on same get ACK, producing multiple replies still, maybe JSON vs YSON?
    				// TMP note for now: viMZq1slG was chat LEX query #.
    				/*if(gun !== (tmp = msg.$) && (tmp = (tmp||'')._)){
    					if(tmp.Q){ tmp.Q[msg['#']] = ''; return } // chain does not need to ask for it again.
    					tmp.Q = {};
    				}*/
    				/*if(u === has){
    					if(at.Q){
    						//at.Q[msg['#']] = '';
    						//return;
    					}
    					at.Q = {};
    				}*/
    				var ctx = msg._||{}, DBG = ctx.DBG = msg.DBG;
    				DBG && (DBG.g = +new Date);
    				//console.log("GET:", get, node, has);
    				if(!node){ return root.on('get', msg) }
    				if(has){
    					if('string' != typeof has || u === node[has]){ return root.on('get', msg) }
    					node = state_ify({}, has, state_is(node, has), node[has], soul);
    					// If we have a key in-memory, do we really need to fetch?
    					// Maybe... in case the in-memory key we have is a local write
    					// we still need to trigger a pull/merge from peers.
    				}
    				//Gun.window? Gun.obj.copy(node) : node; // HNPERF: If !browser bump Performance? Is this too dangerous to reference root graph? Copy / shallow copy too expensive for big nodes. Gun.obj.to(node); // 1 layer deep copy // Gun.obj.copy(node); // too slow on big nodes
    				node && ack(msg, node);
    				root.on('get', msg); // send GET to storage adapters.
    			};
    			function ack(msg, node){
    				var S = +new Date, ctx = msg._||{}, DBG = ctx.DBG = msg.DBG;
    				var to = msg['#'], id = text_rand(9), keys = Object.keys(node||'').sort(), soul = ((node||'')._||'')['#']; keys.length; var root = msg.$._.root, F = (node === root.graph[soul]);
    				console.STAT && console.STAT(S, ((DBG||ctx).gk = +new Date) - S, 'got keys');
    				// PERF: Consider commenting this out to force disk-only reads for perf testing? // TODO: .keys( is slow
    				node && (function go(){
    					S = +new Date;
    					var i = 0, k, put = {}, tmp;
    					while(i < 9 && (k = keys[i++])){
    						state_ify(put, k, state_is(node, k), node[k], soul);
    					}
    					keys = keys.slice(i);
    					(tmp = {})[soul] = put; put = tmp;
    					var faith; if(F){ faith = function(){}; faith.ram = faith.faith = true; } // HNPERF: We're testing performance improvement by skipping going through security again, but this should be audited.
    					tmp = keys.length;
    					console.STAT && console.STAT(S, -(S - (S = +new Date)), 'got copied some');
    					DBG && (DBG.ga = +new Date);
    					root.on('in', {'@': to, '#': id, put: put, '%': (tmp? (id = text_rand(9)) : u), $: root.$, _: faith, DBG: DBG});
    					console.STAT && console.STAT(S, +new Date - S, 'got in');
    					if(!tmp){ return }
    					setTimeout.turn(go);
    				}());
    				if(!node){ root.on('in', {'@': msg['#']}); } // TODO: I don't think I like this, the default lS adapter uses this but "not found" is a sensitive issue, so should probably be handled more carefully/individually.
    			} Gun.on.get.ack = ack;
    		}());
    (function(){
    			Gun.chain.opt = function(opt){
    				opt = opt || {};
    				var gun = this, at = gun._, tmp = opt.peers || opt;
    				if(!Object.plain(opt)){ opt = {}; }
    				if(!Object.plain(at.opt)){ at.opt = opt; }
    				if('string' == typeof tmp){ tmp = [tmp]; }
    				if(!Object.plain(at.opt.peers)){ at.opt.peers = {};}
    				if(tmp instanceof Array){
    					opt.peers = {};
    					tmp.forEach(function(url){
    						var p = {}; p.id = p.url = url;
    						opt.peers[url] = at.opt.peers[url] = at.opt.peers[url] || p;
    					});
    				}
    				obj_each(opt, function each(k){ var v = this[k];
    					if((this && this.hasOwnProperty(k)) || 'string' == typeof v || Object.empty(v)){ this[k] = v; return }
    					if(v && v.constructor !== Object && !(v instanceof Array)){ return }
    					obj_each(v, each);
    				});
    				at.opt.from = opt;
    				Gun.on('opt', at);
    				at.opt.uuid = at.opt.uuid || function uuid(l){ return Gun.state().toString(36).replace('.','') + String.random(l||12) };
    				return gun;
    			};
    		}());

    		var obj_each = function(o,f){ Object.keys(o).forEach(f,o); }, text_rand = String.random, turn = setTimeout.turn, valid = Gun.valid, state_is = Gun.state.is, state_ify = Gun.state.ify, u, empty = {}, C;

    		Gun.log = function(){ return (!Gun.log.off && C.log.apply(C, arguments)), [].slice.call(arguments).join(' ') };
    		Gun.log.once = function(w,s,o){ return (o = Gun.log.once)[w] = o[w] || 0, o[w]++ || Gun.log(s) };

    		if(typeof window !== "undefined"){ (window.GUN = window.Gun = Gun).window = window; }
    		try{ if(typeof MODULE !== "undefined"){ MODULE.exports = Gun; } }catch(e){}
    		module.exports = Gun;
    		
    		(Gun.window||{}).console = (Gun.window||{}).console || {log: function(){}};
    		(C = console).only = function(i, s){ return (C.only.i && i === C.only.i && C.only.i++) && (C.log.apply(C, arguments) || s) };
    		Gun.log.once("welcome", "Hello wonderful person! :) Thanks for using GUN, please ask for help on http://chat.gun.eco if anything takes you longer than 5min to figure out!");
    	})(USE, './root');
    USE(function(module){
    		var Gun = USE('./root');
    		Gun.chain.back = function(n, opt){ var tmp;
    			n = n || 1;
    			if(-1 === n || Infinity === n){
    				return this._.root.$;
    			} else
    			if(1 === n){
    				return (this._.back || this._).$;
    			}
    			var gun = this, at = gun._;
    			if(typeof n === 'string'){
    				n = n.split('.');
    			}
    			if(n instanceof Array){
    				var i = 0, l = n.length, tmp = at;
    				for(i; i < l; i++){
    					tmp = (tmp||empty)[n[i]];
    				}
    				if(u !== tmp){
    					return opt? gun : tmp;
    				} else
    				if((tmp = at.back)){
    					return tmp.$.back(n, opt);
    				}
    				return;
    			}
    			if('function' == typeof n){
    				var yes, tmp = {back: at};
    				while((tmp = tmp.back)
    				&& u === (yes = n(tmp, opt))){}
    				return yes;
    			}
    			if('number' == typeof n){
    				return (at.back || at).$.back(n - 1);
    			}
    			return this;
    		};
    		var empty = {}, u;
    	})(USE, './back');
    USE(function(module){
    		// WARNING: GUN is very simple, but the JavaScript chaining API around GUN
    		// is complicated and was extremely hard to build. If you port GUN to another
    		// language, consider implementing an easier API to build.
    		var Gun = USE('./root');
    		Gun.chain.chain = function(sub){
    			var gun = this, at = gun._, chain = new (sub || gun).constructor(gun), cat = chain._, root;
    			cat.root = root = at.root;
    			cat.id = ++root.once;
    			cat.back = gun._;
    			cat.on = Gun.on;
    			cat.on('in', Gun.on.in, cat); // For 'in' if I add my own listeners to each then I MUST do it before in gets called. If I listen globally for all incoming data instead though, regardless of individual listeners, I can transform the data there and then as well.
    			cat.on('out', Gun.on.out, cat); // However for output, there isn't really the global option. I must listen by adding my own listener individually BEFORE this one is ever called.
    			return chain;
    		};

    		function output(msg){
    			var get, at = this.as, back = at.back, root = at.root, tmp;
    			if(!msg.$){ msg.$ = at.$; }
    			this.to.next(msg);
    			if(at.err){ at.on('in', {put: at.put = u, $: at.$}); return }
    			if(get = msg.get){
    				/*if(u !== at.put){
    					at.on('in', at);
    					return;
    				}*/
    				if(root.pass){ root.pass[at.id] = at; } // will this make for buggy behavior elsewhere?
    				if(at.lex){ Object.keys(at.lex).forEach(function(k){ tmp[k] = at.lex[k]; }, tmp = msg.get = msg.get || {}); }
    				if(get['#'] || at.soul){
    					get['#'] = get['#'] || at.soul;
    					msg['#'] || (msg['#'] = text_rand(9)); // A3120 ?
    					back = (root.$.get(get['#'])._);
    					if(!(get = get['.'])){ // soul
    						tmp = back.ask && back.ask['']; // check if we have already asked for the full node
    						(back.ask || (back.ask = {}))[''] = back; // add a flag that we are now.
    						if(u !== back.put){ // if we already have data,
    							back.on('in', back); // send what is cached down the chain
    							if(tmp){ return } // and don't ask for it again.
    						}
    						msg.$ = back.$;
    					} else
    					if(obj_has(back.put, get)){ // TODO: support #LEX !
    						tmp = back.ask && back.ask[get];
    						(back.ask || (back.ask = {}))[get] = back.$.get(get)._;
    						back.on('in', {get: get, put: {'#': back.soul, '.': get, ':': back.put[get], '>': state_is(root.graph[back.soul], get)}});
    						if(tmp){ return }
    					}
    						/*put = (back.$.get(get)._);
    						if(!(tmp = put.ack)){ put.ack = -1 }
    						back.on('in', {
    							$: back.$,
    							put: Gun.state.ify({}, get, Gun.state(back.put, get), back.put[get]),
    							get: back.get
    						});
    						if(tmp){ return }
    					} else
    					if('string' != typeof get){
    						var put = {}, meta = (back.put||{})._;
    						Gun.obj.map(back.put, function(v,k){
    							if(!Gun.text.match(k, get)){ return }
    							put[k] = v;
    						})
    						if(!Gun.obj.empty(put)){
    							put._ = meta;
    							back.on('in', {$: back.$, put: put, get: back.get})
    						}
    						if(tmp = at.lex){
    							tmp = (tmp._) || (tmp._ = function(){});
    							if(back.ack < tmp.ask){ tmp.ask = back.ack }
    							if(tmp.ask){ return }
    							tmp.ask = 1;
    						}
    					}
    					*/
    					root.ask(ack, msg); // A3120 ?
    					return root.on('in', msg);
    				}
    				//if(root.now){ root.now[at.id] = root.now[at.id] || true; at.pass = {} }
    				if(get['.']){
    					if(at.get){
    						msg = {get: {'.': at.get}, $: at.$};
    						(back.ask || (back.ask = {}))[at.get] = msg.$._; // TODO: PERFORMANCE? More elegant way?
    						return back.on('out', msg);
    					}
    					msg = {get: at.lex? msg.get : {}, $: at.$};
    					return back.on('out', msg);
    				}
    				(at.ask || (at.ask = {}))[''] = at;	 //at.ack = at.ack || -1;
    				if(at.get){
    					get['.'] = at.get;
    					(back.ask || (back.ask = {}))[at.get] = msg.$._; // TODO: PERFORMANCE? More elegant way?
    					return back.on('out', msg);
    				}
    			}
    			return back.on('out', msg);
    		} Gun.on.out = output;

    		function input(msg, cat){ cat = cat || this.as; // TODO: V8 may not be able to optimize functions with different parameter calls, so try to do benchmark to see if there is any actual difference.
    			var root = cat.root, gun = msg.$ || (msg.$ = cat.$), at = (gun||'')._ || empty, tmp = msg.put||'', soul = tmp['#'], key = tmp['.'], change = (u !== tmp['='])? tmp['='] : tmp[':'], state = tmp['>'] || -Infinity, sat; // eve = event, at = data at, cat = chain at, sat = sub at (children chains).
    			if(u !== msg.put && (u === tmp['#'] || u === tmp['.'] || (u === tmp[':'] && u === tmp['=']) || u === tmp['>'])){ // convert from old format
    				if(!valid(tmp)){
    					if(!(soul = ((tmp||'')._||'')['#'])){ console.log("chain not yet supported for", tmp, '...', msg, cat); return; }
    					gun = cat.root.$.get(soul);
    					return setTimeout.each(Object.keys(tmp).sort(), function(k){ // TODO: .keys( is slow // BUG? ?Some re-in logic may depend on this being sync?
    						if('_' == k || u === (state = state_is(tmp, k))){ return }
    						cat.on('in', {$: gun, put: {'#': soul, '.': k, '=': tmp[k], '>': state}, VIA: msg});
    					});
    				}
    				cat.on('in', {$: at.back.$, put: {'#': soul = at.back.soul, '.': key = at.has || at.get, '=': tmp, '>': state_is(at.back.put, key)}, via: msg}); // TODO: This could be buggy! It assumes/approxes data, other stuff could have corrupted it.
    				return;
    			}
    			if((msg.seen||'')[cat.id]){ return } (msg.seen || (msg.seen = function(){}))[cat.id] = cat; // help stop some infinite loops

    			if(cat !== at){ // don't worry about this when first understanding the code, it handles changing contexts on a message. A soul chain will never have a different context.
    				Object.keys(msg).forEach(function(k){ tmp[k] = msg[k]; }, tmp = {}); // make copy of message
    				tmp.get = cat.get || tmp.get;
    				if(!cat.soul && !cat.has){ // if we do not recognize the chain type
    					tmp.$$$ = tmp.$$$ || cat.$; // make a reference to wherever it came from.
    				} else
    				if(at.soul){ // a has (property) chain will have a different context sometimes if it is linked (to a soul chain). Anything that is not a soul or has chain, will always have different contexts.
    					tmp.$ = cat.$;
    					tmp.$$ = tmp.$$ || at.$;
    				}
    				msg = tmp; // use the message with the new context instead;
    			}
    			unlink(msg, cat);

    			if(((cat.soul/* && (cat.ask||'')['']*/) || msg.$$) && state >= state_is(root.graph[soul], key)){ // The root has an in-memory cache of the graph, but if our peer has asked for the data then we want a per deduplicated chain copy of the data that might have local edits on it.
    				(tmp = root.$.get(soul)._).put = state_ify(tmp.put, key, state, change, soul);
    			}
    			if(!at.soul /*&& (at.ask||'')['']*/ && state >= state_is(root.graph[soul], key) && (sat = (root.$.get(soul)._.next||'')[key])){ // Same as above here, but for other types of chains. // TODO: Improve perf by preventing echoes recaching.
    				sat.put = change; // update cache
    				if('string' == typeof (tmp = valid(change))){
    					sat.put = root.$.get(tmp)._.put || change; // share same cache as what we're linked to.
    				}
    			}

    			this.to && this.to.next(msg); // 1st API job is to call all chain listeners.
    			// TODO: Make input more reusable by only doing these (some?) calls if we are a chain we recognize? This means each input listener would be responsible for when listeners need to be called, which makes sense, as they might want to filter.
    			cat.any && setTimeout.each(Object.keys(cat.any), function(any){ (any = cat.any[any]) && any(msg); },0,99); // 1st API job is to call all chain listeners. // TODO: .keys( is slow // BUG: Some re-in logic may depend on this being sync.
    			cat.echo && setTimeout.each(Object.keys(cat.echo), function(lat){ (lat = cat.echo[lat]) && lat.on('in', msg); },0,99); // & linked at chains // TODO: .keys( is slow // BUG: Some re-in logic may depend on this being sync.

    			if(((msg.$$||'')._||at).soul){ // comments are linear, but this line of code is non-linear, so if I were to comment what it does, you'd have to read 42 other comments first... but you can't read any of those comments until you first read this comment. What!? // shouldn't this match link's check?
    				// is there cases where it is a $$ that we do NOT want to do the following? 
    				if((sat = cat.next) && (sat = sat[key])){ // TODO: possible trick? Maybe have `ionmap` code set a sat? // TODO: Maybe we should do `cat.ask` instead? I guess does not matter.
    					tmp = {}; Object.keys(msg).forEach(function(k){ tmp[k] = msg[k]; });
    					tmp.$ = (msg.$$||msg.$).get(tmp.get = key); delete tmp.$$; delete tmp.$$$;
    					sat.on('in', tmp);
    				}
    			}

    			link(msg, cat);
    		} Gun.on.in = input;

    		function link(msg, cat){ cat = cat || this.as || msg.$._;
    			if(msg.$$ && this !== Gun.on){ return } // $$ means we came from a link, so we are at the wrong level, thus ignore it unless overruled manually by being called directly.
    			if(!msg.put || cat.soul){ return } // But you cannot overrule being linked to nothing, or trying to link a soul chain - that must never happen.
    			var put = msg.put||'', link = put['=']||put[':'], tmp;
    			var root = cat.root, tat = root.$.get(put['#']).get(put['.'])._;
    			if('string' != typeof (link = valid(link))){
    				if(this === Gun.on){ (tat.echo || (tat.echo = {}))[cat.id] = cat; } // allow some chain to explicitly force linking to simple data.
    				return; // by default do not link to data that is not a link.
    			}
    			if((tat.echo || (tat.echo = {}))[cat.id] // we've already linked ourselves so we do not need to do it again. Except... (annoying implementation details)
    				&& !(root.pass||'')[cat.id]){ return } // if a new event listener was added, we need to make a pass through for it. The pass will be on the chain, not always the chain passed down. 
    			if(tmp = root.pass){ if(tmp[link+cat.id]){ return } tmp[link+cat.id] = 1; } // But the above edge case may "pass through" on a circular graph causing infinite passes, so we hackily add a temporary check for that.

    			(tat.echo||(tat.echo={}))[cat.id] = cat; // set ourself up for the echo! // TODO: BUG? Echo to self no longer causes problems? Confirm.

    			if(cat.has){ cat.link = link; }
    			var sat = root.$.get(tat.link = link)._; // grab what we're linking to.
    			(sat.echo || (sat.echo = {}))[tat.id] = tat; // link it.
    			var tmp = cat.ask||''; // ask the chain for what needs to be loaded next!
    			if(tmp[''] || cat.lex){ // we might need to load the whole thing // TODO: cat.lex probably has edge case bugs to it, need more test coverage.
    				sat.on('out', {get: {'#': link}});
    			}
    			setTimeout.each(Object.keys(tmp), function(get, sat){ // if sub chains are asking for data. // TODO: .keys( is slow // BUG? ?Some re-in logic may depend on this being sync?
    				if(!get || !(sat = tmp[get])){ return }
    				sat.on('out', {get: {'#': link, '.': get}}); // go get it.
    			},0,99);
    		} Gun.on.link = link;

    		function unlink(msg, cat){ // ugh, so much code for seemingly edge case behavior.
    			var put = msg.put||'', change = (u !== put['='])? put['='] : put[':'], root = cat.root, link, tmp;
    			if(u === change){ // 1st edge case: If we have a brand new database, no data will be found.
    				// TODO: BUG! because emptying cache could be async from below, make sure we are not emptying a newer cache. So maybe pass an Async ID to check against?
    				// TODO: BUG! What if this is a map? // Warning! Clearing things out needs to be robust against sync/async ops, or else you'll see `map val get put` test catastrophically fail because map attempts to link when parent graph is streamed before child value gets set. Need to differentiate between lack acks and force clearing.
    				if(cat.soul && u !== cat.put){ return } // data may not be found on a soul, but if a soul already has data, then nothing can clear the soul as a whole.
    				//if(!cat.has){ return }
    				tmp = (msg.$$||msg.$||'')._||'';
    				if(msg['@'] && (u !== tmp.put || u !== cat.put)){ return } // a "not found" from other peers should not clear out data if we have already found it.
    				//if(cat.has && u === cat.put && !(root.pass||'')[cat.id]){ return } // if we are already unlinked, do not call again, unless edge case. // TODO: BUG! This line should be deleted for "unlink deeply nested".
    				if(link = cat.link || msg.linked){
    					delete (root.$.get(link)._.echo||'')[cat.id];
    				}
    				if(cat.has){ // TODO: Empty out links, maps, echos, acks/asks, etc.?
    					cat.link = null;
    				}
    				cat.put = u; // empty out the cache if, for example, alice's car's color no longer exists (relative to alice) if alice no longer has a car.
    				// TODO: BUG! For maps, proxy this so the individual sub is triggered, not all subs.
    				setTimeout.each(Object.keys(cat.next||''), function(get, sat){ // empty out all sub chains. // TODO: .keys( is slow // BUG? ?Some re-in logic may depend on this being sync? // TODO: BUG? This will trigger deeper put first, does put logic depend on nested order? // TODO: BUG! For map, this needs to be the isolated child, not all of them.
    					if(!(sat = cat.next[get])){ return }
    					//if(cat.has && u === sat.put && !(root.pass||'')[sat.id]){ return } // if we are already unlinked, do not call again, unless edge case. // TODO: BUG! This line should be deleted for "unlink deeply nested".
    					if(link){ delete (root.$.get(link).get(get)._.echo||'')[sat.id]; }
    					sat.on('in', {get: get, put: u, $: sat.$}); // TODO: BUG? Add recursive seen check?
    				},0,99);
    				return;
    			}
    			if(cat.soul){ return } // a soul cannot unlink itself.
    			if(msg.$$){ return } // a linked chain does not do the unlinking, the sub chain does. // TODO: BUG? Will this cancel maps?
    			link = valid(change); // need to unlink anytime we are not the same link, though only do this once per unlink (and not on init).
    			tmp = msg.$._||'';
    			if(link === tmp.link || (cat.has && !tmp.link)){
    				if((root.pass||'')[cat.id] && 'string' !== typeof link); else {
    					return;
    				}
    			}
    			delete (tmp.echo||'')[cat.id];
    			unlink({get: cat.get, put: u, $: msg.$, linked: msg.linked = msg.linked || tmp.link}, cat); // unlink our sub chains.
    		} Gun.on.unlink = unlink;

    		function ack(msg, ev){
    			//if(!msg['%'] && (this||'').off){ this.off() } // do NOT memory leak, turn off listeners! Now handled by .ask itself
    			// manhattan:
    			var as = this.as, at = as.$._; at.root; var get = as.get||'', tmp = (msg.put||'')[get['#']]||'';
    			if(!msg.put || ('string' == typeof get['.'] && u === tmp[get['.']])){
    				if(u !== at.put){ return }
    				if(!at.soul && !at.has){ return } // TODO: BUG? For now, only core-chains will handle not-founds, because bugs creep in if non-core chains are used as $ but we can revisit this later for more powerful extensions.
    				at.ack = (at.ack || 0) + 1;
    				at.on('in', {
    					get: at.get,
    					put: at.put = u,
    					$: at.$,
    					'@': msg['@']
    				});
    				/*(tmp = at.Q) && setTimeout.each(Object.keys(tmp), function(id){ // TODO: Temporary testing, not integrated or being used, probably delete.
    					Object.keys(msg).forEach(function(k){ tmp[k] = msg[k] }, tmp = {}); tmp['@'] = id; // copy message
    					root.on('in', tmp);
    				}); delete at.Q;*/
    				return;
    			}
    			(msg._||{}).miss = 1;
    			Gun.on.put(msg);
    			return; // eom
    		}

    		var empty = {}, u, text_rand = String.random, valid = Gun.valid, obj_has = function(o, k){ return o && Object.prototype.hasOwnProperty.call(o, k) }, state = Gun.state, state_is = state.is, state_ify = state.ify;
    	})(USE, './chain');
    USE(function(module){
    		var Gun = USE('./root');
    		Gun.chain.get = function(key, cb, as){
    			var gun, tmp;
    			if(typeof key === 'string'){
    				if(key.length == 0) {	
    					(gun = this.chain())._.err = {err: Gun.log('0 length key!', key)};
    					if(cb){ cb.call(gun, gun._.err); }
    					return gun;
    				}
    				var back = this, cat = back._;
    				var next = cat.next || empty;
    				if(!(gun = next[key])){
    					gun = key && cache(key, back);
    				}
    				gun = gun && gun.$;
    			} else
    			if('function' == typeof key){
    				if(true === cb){ return soul(this, key, cb, as), this }
    				gun = this;
    				var cat = gun._, opt = cb || {}, root = cat.root, id;
    				opt.at = cat;
    				opt.ok = key;
    				var wait = {}; // can we assign this to the at instead, like in once?
    				//var path = []; cat.$.back(at => { at.get && path.push(at.get.slice(0,9))}); path = path.reverse().join('.');
    				function any(msg, eve, f){
    					if(any.stun){ return }
    					if((tmp = root.pass) && !tmp[id]){ return }
    					var at = msg.$._, sat = (msg.$$||'')._, data = (sat||at).put, odd = (!at.has && !at.soul), test = {}, tmp;
    					if(odd || u === data){ // handles non-core
    						data = (u === ((tmp = msg.put)||'')['='])? (u === (tmp||'')[':'])? tmp : tmp[':'] : tmp['='];
    					}
    					if(('string' == typeof (tmp = Gun.valid(data)))){
    						data = (u === (tmp = root.$.get(tmp)._.put))? opt.not? u : data : tmp;
    					}
    					if(opt.not && u === data){ return }
    					if(u === opt.stun){
    						if((tmp = root.stun) && tmp.on){
    							cat.$.back(function(a){ // our chain stunned?
    								tmp.on(''+a.id, test = {});
    								if((test.run || 0) < any.id){ return test } // if there is an earlier stun on gapless parents/self.
    							});
    							!test.run && tmp.on(''+at.id, test = {}); // this node stunned?
    							!test.run && sat && tmp.on(''+sat.id, test = {}); // linked node stunned?
    							if(any.id > test.run){
    								if(!test.stun || test.stun.end){
    									test.stun = tmp.on('stun');
    									test.stun = test.stun && test.stun.last;
    								}
    								if(test.stun && !test.stun.end){
    									//if(odd && u === data){ return }
    									//if(u === msg.put){ return } // "not found" acks will be found if there is stun, so ignore these.
    									(test.stun.add || (test.stun.add = {}))[id] = function(){ any(msg,eve,1); }; // add ourself to the stun callback list that is called at end of the write.
    									return;
    								}
    							}
    						}
    						if(/*odd &&*/ u === data){ f = 0; } // if data not found, keep waiting/trying.
    						/*if(f && u === data){
    							cat.on('out', opt.out);
    							return;
    						}*/
    						if((tmp = root.hatch) && !tmp.end && u === opt.hatch && !f){ // quick hack! // What's going on here? Because data is streamed, we get things one by one, but a lot of developers would rather get a callback after each batch instead, so this does that by creating a wait list per chain id that is then called at the end of the batch by the hatch code in the root put listener.
    							if(wait[at.$._.id]){ return } wait[at.$._.id] = 1;
    							tmp.push(function(){any(msg,eve,1);});
    							return;
    						} wait = {}; // end quick hack.
    					}
    					// call:
    					if(root.pass){ if(root.pass[id+at.id]){ return } root.pass[id+at.id] = 1; }
    					if(opt.on){ opt.ok.call(at.$, data, at.get, msg, eve || any); return } // TODO: Also consider breaking `this` since a lot of people do `=>` these days and `.call(` has slower performance.
    					if(opt.v2020){ opt.ok(msg, eve || any); return }
    					Object.keys(msg).forEach(function(k){ tmp[k] = msg[k]; }, tmp = {}); msg = tmp; msg.put = data; // 2019 COMPATIBILITY! TODO: GET RID OF THIS!
    					opt.ok.call(opt.as, msg, eve || any); // is this the right
    				}				any.at = cat;
    				//(cat.any||(cat.any=function(msg){ setTimeout.each(Object.keys(cat.any||''), function(act){ (act = cat.any[act]) && act(msg) },0,99) }))[id = String.random(7)] = any; // maybe switch to this in future?
    				(cat.any||(cat.any={}))[id = String.random(7)] = any;
    				any.off = function(){ any.stun = 1; if(!cat.any){ return } delete cat.any[id]; };
    				any.rid = rid; // logic from old version, can we clean it up now?
    				any.id = opt.run || ++root.once; // used in callback to check if we are earlier than a write. // will this ever cause an integer overflow?
    				tmp = root.pass; (root.pass = {})[id] = 1; // Explanation: test trade-offs want to prevent recursion so we add/remove pass flag as it gets fulfilled to not repeat, however map map needs many pass flags - how do we reconcile?
    				opt.out = opt.out || {get: {}};
    				cat.on('out', opt.out);
    				root.pass = tmp;
    				return gun;
    			} else
    			if('number' == typeof key){
    				return this.get(''+key, cb, as);
    			} else
    			if('string' == typeof (tmp = valid(key))){
    				return this.get(tmp, cb, as);
    			} else
    			if(tmp = this.get.next){
    				gun = tmp(this, key);
    			}
    			if(!gun){
    				(gun = this.chain())._.err = {err: Gun.log('Invalid get request!', key)}; // CLEAN UP
    				if(cb){ cb.call(gun, gun._.err); }
    				return gun;
    			}
    			if(cb && 'function' == typeof cb){
    				gun.get(cb, as);
    			}
    			return gun;
    		};
    		function cache(key, back){
    			var cat = back._, next = cat.next, gun = back.chain(), at = gun._;
    			if(!next){ next = cat.next = {}; }
    			next[at.get = key] = at;
    			if(back === cat.root.$){
    				at.soul = key;
    			} else
    			if(cat.soul || cat.has){
    				at.has = key;
    				//if(obj_has(cat.put, key)){
    					//at.put = cat.put[key];
    				//}
    			}
    			return at;
    		}
    		function soul(gun, cb, opt, as){
    			var cat = gun._, acks = 0, tmp;
    			if(tmp = cat.soul || cat.link){ return cb(tmp, as, cat) }
    			if(cat.jam){ return cat.jam.push([cb, as]) }
    			cat.jam = [[cb,as]];
    			gun.get(function go(msg, eve){
    				if(u === msg.put && !cat.root.opt.super && (tmp = Object.keys(cat.root.opt.peers).length) && ++acks <= tmp){ // TODO: super should not be in core code, bring AXE up into core instead to fix? // TODO: .keys( is slow
    					return;
    				}
    				eve.rid(msg);
    				var at = ((at = msg.$) && at._) || {}, i = 0, as;
    				tmp = cat.jam; delete cat.jam; // tmp = cat.jam.splice(0, 100);
    				//if(tmp.length){ process.nextTick(function(){ go(msg, eve) }) }
    				while(as = tmp[i++]){ //Gun.obj.map(tmp, function(as, cb){
    					var cb = as[0]; as = as[1];
    					cb && cb(at.link || at.soul || Gun.valid(msg.put) || ((msg.put||{})._||{})['#'], as, msg, eve);
    				} //);
    			}, {out: {get: {'.':true}}});
    			return gun;
    		}
    		function rid(at){
    			var cat = this.at || this.on;
    			if(!at || cat.soul || cat.has){ return this.off() }
    			if(!(at = (at = (at = at.$ || at)._ || at).id)){ return }
    			cat.map; var seen;
    			//if(!map || !(tmp = map[at]) || !(tmp = tmp.at)){ return }
    			if((seen = this.seen || (this.seen = {}))[at]){ return true }
    			seen[at] = true;
    			return;
    		}
    		var empty = {}, valid = Gun.valid, u;
    	})(USE, './get');
    USE(function(module){
    		var Gun = USE('./root');
    		Gun.chain.put = function(data, cb, as){ // I rewrote it :)
    			var gun = this, at = gun._, root = at.root;
    			as = as || {};
    			as.root = at.root;
    			as.run || (as.run = root.once);
    			stun(as, at.id); // set a flag for reads to check if this chain is writing.
    			as.ack = as.ack || cb;
    			as.via = as.via || gun;
    			as.data = as.data || data;
    			as.soul || (as.soul = at.soul || ('string' == typeof cb && cb));
    			var s = as.state = as.state || Gun.state();
    			if('function' == typeof data){ data(function(d){ as.data = d; gun.put(u,u,as); }); return gun }
    			if(!as.soul){ return get(as), gun }
    			as.$ = root.$.get(as.soul); // TODO: This may not allow user chaining and similar?
    			as.todo = [{it: as.data, ref: as.$}];
    			as.turn = as.turn || turn;
    			as.ran = as.ran || ran;
    			//var path = []; as.via.back(at => { at.get && path.push(at.get.slice(0,9)) }); path = path.reverse().join('.');
    			// TODO: Perf! We only need to stun chains that are being modified, not necessarily written to.
    			(function walk(){
    				var to = as.todo, at = to.pop(), d = at.it; at.ref && at.ref._.id; var v, k, cat, tmp, g;
    				stun(as, at.ref);
    				if(tmp = at.todo){
    					k = tmp.pop(); d = d[k];
    					if(tmp.length){ to.push(at); }
    				}
    				k && (to.path || (to.path = [])).push(k);
    				if(!(v = valid(d)) && !(g = Gun.is(d))){
    					if(!Object.plain(d)){ ran.err(as, "Invalid data: "+ check(d) +" at " + (as.via.back(function(at){at.get && tmp.push(at.get);}, tmp = []) || tmp.join('.'))+'.'+(to.path||[]).join('.')); return }
    					var seen = as.seen || (as.seen = []), i = seen.length;
    					while(i--){ if(d === (tmp = seen[i]).it){ v = d = tmp.link; break } }
    				}
    				if(k && v){ at.node = state_ify(at.node, k, s, d); } // handle soul later.
    				else {
    					if(!as.seen){ ran.err(as, "Data at root of graph must be a node (an object)."); return }
    					as.seen.push(cat = {it: d, link: {}, todo: g? [] : Object.keys(d).sort().reverse(), path: (to.path||[]).slice(), up: at}); // Any perf reasons to CPU schedule this .keys( ?
    					at.node = state_ify(at.node, k, s, cat.link);
    					!g && cat.todo.length && to.push(cat);
    					// ---------------
    					var id = as.seen.length;
    					(as.wait || (as.wait = {}))[id] = '';
    					tmp = (cat.ref = (g? d : k? at.ref.get(k) : at.ref))._;
    					(tmp = (d && (d._||'')['#']) || tmp.soul || tmp.link)? resolve({soul: tmp}) : cat.ref.get(resolve, {run: as.run, /*hatch: 0,*/ v2020:1, out:{get:{'.':' '}}}); // TODO: BUG! This should be resolve ONLY soul to prevent full data from being loaded. // Fixed now?
    					//setTimeout(function(){ if(F){ return } console.log("I HAVE NOT BEEN CALLED!", path, id, cat.ref._.id, k) }, 9000); var F; // MAKE SURE TO ADD F = 1 below!
    					function resolve(msg, eve){
    						var end = cat.link['#'];
    						if(eve){ eve.off(); eve.rid(msg); } // TODO: Too early! Check all peers ack not found.
    						// TODO: BUG maybe? Make sure this does not pick up a link change wipe, that it uses the changign link instead.
    						var soul = end || msg.soul || (tmp = (msg.$$||msg.$)._||'').soul || tmp.link || ((tmp = tmp.put||'')._||'')['#'] || tmp['#'] || (((tmp = msg.put||'') && msg.$$)? tmp['#'] : (tmp['=']||tmp[':']||'')['#']);
    						!end && stun(as, msg.$);
    						if(!soul && !at.link['#']){ // check soul link above us
    							(at.wait || (at.wait = [])).push(function(){ resolve(msg, eve); }); // wait
    							return;
    						}
    						if(!soul){
    							soul = [];
    							(msg.$$||msg.$).back(function(at){
    								if(tmp = at.soul || at.link){ return soul.push(tmp) }
    								soul.push(at.get);
    							});
    							soul = soul.reverse().join('/');
    						}
    						cat.link['#'] = soul;
    						!g && (((as.graph || (as.graph = {}))[soul] = (cat.node || (cat.node = {_:{}})))._['#'] = soul);
    						delete as.wait[id];
    						cat.wait && setTimeout.each(cat.wait, function(cb){ cb && cb(); });
    						as.ran(as);
    					}					// ---------------
    				}
    				if(!to.length){ return as.ran(as) }
    				as.turn(walk);
    			}());
    			return gun;
    		};

    		function stun(as, id){
    			if(!id){ return } id = (id._||'').id||id;
    			var run = as.root.stun || (as.root.stun = {on: Gun.on}), test = {}, tmp;
    			as.stun || (as.stun = run.on('stun', function(){ }));
    			if(tmp = run.on(''+id)){ tmp.the.last.next(test); }
    			if(test.run >= as.run){ return }
    			run.on(''+id, function(test){
    				if(as.stun.end){
    					this.off();
    					this.to.next(test);
    					return;
    				}
    				test.run = test.run || as.run;
    				test.stun = test.stun || as.stun; return;
    			});
    		}

    		function ran(as){
    			if(as.err){ ran.end(as.stun, as.root); return } // move log handle here.
    			if(as.todo.length || as.end || !Object.empty(as.wait)){ return } as.end = 1;
    			var cat = (as.$.back(-1)._), root = cat.root, ask = cat.ask(function(ack){
    				root.on('ack', ack);
    				if(ack.err){ Gun.log(ack); }
    				if(++acks > (as.acks || 0)){ this.off(); } // Adjustable ACKs! Only 1 by default.
    				if(!as.ack){ return }
    				as.ack(ack, this);
    			}, as.opt), acks = 0, stun = as.stun, tmp;
    			(tmp = function(){ // this is not official yet, but quick solution to hack in for now.
    				if(!stun){ return }
    				ran.end(stun, root);
    				setTimeout.each(Object.keys(stun = stun.add||''), function(cb){ if(cb = stun[cb]){cb();} }); // resume the stunned reads // Any perf reasons to CPU schedule this .keys( ?
    			}).hatch = tmp; // this is not official yet ^
    			//console.log(1, "PUT", as.run, as.graph);
    			(as.via._).on('out', {put: as.out = as.graph, opt: as.opt, '#': ask, _: tmp});
    		} ran.end = function(stun,root){
    			stun.end = noop; // like with the earlier id, cheaper to make this flag a function so below callbacks do not have to do an extra type check.
    			if(stun.the.to === stun && stun === stun.the.last){ delete root.stun; }
    			stun.off();
    		}; ran.err = function(as, err){
    			(as.ack||noop).call(as, as.out = { err: as.err = Gun.log(err) });
    			as.ran(as);
    		};

    		function get(as){
    			var at = as.via._, tmp;
    			as.via = as.via.back(function(at){
    				if(at.soul || !at.get){ return at.$ }
    				tmp = as.data; (as.data = {})[at.get] = tmp;
    			});
    			if(!as.via || !as.via._.soul){
    				as.via = at.root.$.get(((as.data||'')._||'')['#'] || at.$.back('opt.uuid')());
    			}
    			as.via.put(as.data, as.ack, as);
    			

    			return;
    		}
    		function check(d, tmp){ return ((d && (tmp = d.constructor) && tmp.name) || typeof d) }

    		var u, noop = function(){}, turn = setTimeout.turn, valid = Gun.valid, state_ify = Gun.state.ify;
    	})(USE, './put');
    USE(function(module){
    		var Gun = USE('./root');
    		USE('./chain');
    		USE('./back');
    		USE('./put');
    		USE('./get');
    		module.exports = Gun;
    	})(USE, './index');
    USE(function(module){
    		var Gun = USE('./index');
    		Gun.chain.on = function(tag, arg, eas, as){ // don't rewrite!
    			var gun = this, cat = gun._; cat.root; var act;
    			if(typeof tag === 'string'){
    				if(!arg){ return cat.on(tag) }
    				act = cat.on(tag, arg, eas || cat, as);
    				if(eas && eas.$){
    					(eas.subs || (eas.subs = [])).push(act);
    				}
    				return gun;
    			}
    			var opt = arg;
    			(opt = (true === opt)? {change: true} : opt || {}).not = 1; opt.on = 1;
    			gun.get(tag, opt);
    			/*gun.get(function on(data,key,msg,eve){ var $ = this;
    				if(tmp = root.hatch){ // quick hack!
    					if(wait[$._.id]){ return } wait[$._.id] = 1;
    					tmp.push(function(){on.call($, data,key,msg,eve)});
    					return;
    				}; wait = {}; // end quick hack.
    				tag.call($, data,key,msg,eve);
    			}, opt); // TODO: PERF! Event listener leak!!!?*/
    			/*
    			function one(msg, eve){
    				if(one.stun){ return }
    				var at = msg.$._, data = at.put, tmp;
    				if(tmp = at.link){ data = root.$.get(tmp)._.put }
    				if(opt.not===u && u === data){ return }
    				if(opt.stun===u && (tmp = root.stun) && (tmp = tmp[at.id] || tmp[at.back.id]) && !tmp.end){ // Remember! If you port this into `.get(cb` make sure you allow stun:0 skip option for `.put(`.
    					tmp[id] = function(){one(msg,eve)};
    					return;
    				}
    				//tmp = one.wait || (one.wait = {}); console.log(tmp[at.id] === ''); if(tmp[at.id] !== ''){ tmp[at.id] = tmp[at.id] || setTimeout(function(){tmp[at.id]='';one(msg,eve)},1); return } delete tmp[at.id];
    				// call:
    				if(opt.as){
    					opt.ok.call(opt.as, msg, eve || one);
    				} else {
    					opt.ok.call(at.$, data, msg.get || at.get, msg, eve || one);
    				}
    			};
    			one.at = cat;
    			(cat.act||(cat.act={}))[id = String.random(7)] = one;
    			one.off = function(){ one.stun = 1; if(!cat.act){ return } delete cat.act[id] }
    			cat.on('out', {get: {}});*/
    			return gun;
    		};
    		// Rules:
    		// 1. If cached, should be fast, but not read while write.
    		// 2. Should not retrigger other listeners, should get triggered even if nothing found.
    		// 3. If the same callback passed to many different once chains, each should resolve - an unsubscribe from the same callback should not effect the state of the other resolving chains, if you do want to cancel them all early you should mutate the callback itself with a flag & check for it at top of callback
    		Gun.chain.once = function(cb, opt){ opt = opt || {}; // avoid rewriting
    			if(!cb){ return none(this) }
    			var gun = this, cat = gun._, root = cat.root; cat.put; var id = String.random(7), tmp;
    			gun.get(function(data,key,msg,eve){
    				var $ = this, at = $._, one = (at.one||(at.one={}));
    				if(eve.stun){ return } if('' === one[id]){ return }
    				if(true === (tmp = Gun.valid(data))){ once(); return }
    				if('string' == typeof tmp){ return } // TODO: BUG? Will this always load?
    				clearTimeout((cat.one||'')[id]); // clear "not found" since they only get set on cat.
    				clearTimeout(one[id]); one[id] = setTimeout(once, opt.wait||99); // TODO: Bug? This doesn't handle plural chains.
    				function once(f){
    					if(!at.has && !at.soul){ at = {put: data, get: key}; } // handles non-core messages.
    					if(u === (tmp = at.put)){ tmp = ((msg.$$||'')._||'').put; }
    					if('string' == typeof Gun.valid(tmp)){
    						tmp = root.$.get(tmp)._.put;
    						if(tmp === u && !f){
    							one[id] = setTimeout(function(){ once(1); }, opt.wait||99); // TODO: Quick fix. Maybe use ack count for more predictable control?
    							return
    						}
    					}
    					//console.log("AND VANISHED", data);
    					if(eve.stun){ return } if('' === one[id]){ return } one[id] = '';
    					if(cat.soul || cat.has){ eve.off(); } // TODO: Plural chains? // else { ?.off() } // better than one check?
    					cb.call($, tmp, at.get);
    					clearTimeout(one[id]); // clear "not found" since they only get set on cat. // TODO: This was hackily added, is it necessary or important? Probably not, in future try removing this. Was added just as a safety for the `&& !f` check.
    				}			}, {on: 1});
    			return gun;
    		};
    		function none(gun,opt,chain){
    			Gun.log.once("valonce", "Chainable val is experimental, its behavior and API may change moving forward. Please play with it and report bugs and ideas on how to improve it.");
    			(chain = gun.chain())._.nix = gun.once(function(data, key){ chain._.on('in', this._); });
    			chain._.lex = gun._.lex; // TODO: Better approach in future? This is quick for now.
    			return chain;
    		}

    		Gun.chain.off = function(){
    			// make off more aggressive. Warning, it might backfire!
    			var gun = this, at = gun._, tmp;
    			var cat = at.back;
    			if(!cat){ return }
    			at.ack = 0; // so can resubscribe.
    			if(tmp = cat.next){
    				if(tmp[at.get]){
    					delete tmp[at.get];
    				}
    			}
    			// TODO: delete cat.one[map.id]?
    			if(tmp = cat.ask){
    				delete tmp[at.get];
    			}
    			if(tmp = cat.put){
    				delete tmp[at.get];
    			}
    			if(tmp = at.soul){
    				delete cat.root.graph[tmp];
    			}
    			if(tmp = at.map){
    				Object.keys(tmp).forEach(function(i,at){ at = tmp[i]; //obj_map(tmp, function(at){
    					if(at.link){
    						cat.root.$.get(at.link).off();
    					}
    				});
    			}
    			if(tmp = at.next){
    				Object.keys(tmp).forEach(function(i,neat){ neat = tmp[i]; //obj_map(tmp, function(neat){
    					neat.$.off();
    				});
    			}
    			at.on('off', {});
    			return gun;
    		};
    		var u;
    	})(USE, './on');
    USE(function(module){
    		var Gun = USE('./index'), next = Gun.chain.get.next;
    		Gun.chain.get.next = function(gun, lex){ var tmp;
    			if(!Object.plain(lex)){ return (next||noop)(gun, lex) }
    			if(tmp = ((tmp = lex['#'])||'')['='] || tmp){ return gun.get(tmp) }
    			(tmp = gun.chain()._).lex = lex; // LEX!
    			gun.on('in', function(eve){
    				if(String.match(eve.get|| (eve.put||'')['.'], lex['.'] || lex['#'] || lex)){
    					tmp.on('in', eve);
    				}
    				this.to.next(eve);
    			});
    			return tmp.$;
    		};
    		Gun.chain.map = function(cb, opt, t){
    			var gun = this, cat = gun._, lex, chain;
    			if(Object.plain(cb)){ lex = cb['.']? cb : {'.': cb}; cb = u; }
    			if(!cb){
    				if(chain = cat.each){ return chain }
    				(cat.each = chain = gun.chain())._.lex = lex || chain._.lex || cat.lex;
    				chain._.nix = gun.back('nix');
    				gun.on('in', map, chain._);
    				return chain;
    			}
    			Gun.log.once("mapfn", "Map functions are experimental, their behavior and API may change moving forward. Please play with it and report bugs and ideas on how to improve it.");
    			chain = gun.chain();
    			gun.map().on(function(data, key, msg, eve){
    				var next = (cb||noop).call(this, data, key, msg, eve);
    				if(u === next){ return }
    				if(data === next){ return chain._.on('in', msg) }
    				if(Gun.is(next)){ return chain._.on('in', next._) }
    				var tmp = {}; Object.keys(msg.put).forEach(function(k){ tmp[k] = msg.put[k]; }, tmp); tmp['='] = next; 
    				chain._.on('in', {get: key, put: tmp});
    			});
    			return chain;
    		};
    		function map(msg){ this.to.next(msg);
    			var cat = this.as, gun = msg.$, at = gun._, put = msg.put, tmp;
    			if(!at.soul && !msg.$$){ return } // this line took hundreds of tries to figure out. It only works if core checks to filter out above chains during link tho. This says "only bother to map on a node" for this layer of the chain. If something is not a node, map should not work.
    			if((tmp = cat.lex) && !String.match(msg.get|| (put||'')['.'], tmp['.'] || tmp['#'] || tmp)){ return }
    			Gun.on.link(msg, cat);
    		}
    		var noop = function(){}, u;
    	})(USE, './map');
    USE(function(module){
    		var Gun = USE('./index');
    		Gun.chain.set = function(item, cb, opt){
    			var gun = this, root = gun.back(-1), soul, tmp;
    			cb = cb || function(){};
    			opt = opt || {}; opt.item = opt.item || item;
    			if(soul = ((item||'')._||'')['#']){ (item = {})['#'] = soul; } // check if node, make link.
    			if('string' == typeof (tmp = Gun.valid(item))){ return gun.get(soul = tmp).put(item, cb, opt) } // check if link
    			if(!Gun.is(item)){
    				if(Object.plain(item)){
    					item = root.get(soul = gun.back('opt.uuid')()).put(item);
    				}
    				return gun.get(soul || root.back('opt.uuid')(7)).put(item, cb, opt);
    			}
    			gun.put(function(go){
    				item.get(function(soul, o, msg){ // TODO: BUG! We no longer have this option? & go error not handled?
    					if(!soul){ return cb.call(gun, {err: Gun.log('Only a node can be linked! Not "' + msg.put + '"!')}) }
    					(tmp = {})[soul] = {'#': soul}; go(tmp);
    				},true);
    			});
    			return item;
    		};
    	})(USE, './set');
    USE(function(module){
    		USE('./shim');

    		var noop = function(){};
    		var parse = JSON.parseAsync || function(t,cb,r){ var u, d = +new Date; try{ cb(u, JSON.parse(t,r), json.sucks(+new Date - d)); }catch(e){ cb(e); } };
    		var json = JSON.stringifyAsync || function(v,cb,r,s){ var u, d = +new Date; try{ cb(u, JSON.stringify(v,r,s), json.sucks(+new Date - d)); }catch(e){ cb(e); } };
    		json.sucks = function(d){ if(d > 99){ console.log("Warning: JSON blocking CPU detected. Add `gun/lib/yson.js` to fix."); json.sucks = noop; } };

    		function Mesh(root){
    			var mesh = function(){};
    			var opt = root.opt || {};
    			opt.log = opt.log || console.log;
    			opt.gap = opt.gap || opt.wait || 0;
    			opt.max = opt.max || (opt.memory? (opt.memory * 999 * 999) : 300000000) * 0.3;
    			opt.pack = opt.pack || (opt.max * 0.01 * 0.01);
    			opt.puff = opt.puff || 9; // IDEA: do a start/end benchmark, divide ops/result.
    			var puff = setTimeout.turn || setTimeout;

    			var dup = root.dup, dup_check = dup.check, dup_track = dup.track;

    			var hear = mesh.hear = function(raw, peer){
    				if(!raw){ return }
    				if(opt.max <= raw.length){ return mesh.say({dam: '!', err: "Message too big!"}, peer) }
    				if(mesh === this){
    					/*if('string' == typeof raw){ try{
    						var stat = console.STAT || {};
    						//console.log('HEAR:', peer.id, (raw||'').slice(0,250), ((raw||'').length / 1024 / 1024).toFixed(4));
    						
    						//console.log(setTimeout.turn.s.length, 'stacks', parseFloat((-(LT - (LT = +new Date))/1000).toFixed(3)), 'sec', parseFloat(((LT-ST)/1000 / 60).toFixed(1)), 'up', stat.peers||0, 'peers', stat.has||0, 'has', stat.memhused||0, stat.memused||0, stat.memax||0, 'heap mem max');
    					}catch(e){ console.log('DBG err', e) }}*/
    					hear.d += raw.length||0 ; ++hear.c; } // STATS!
    				var S = peer.SH = +new Date;
    				var tmp = raw[0], msg;
    				//raw && raw.slice && console.log("hear:", ((peer.wire||'').headers||'').origin, raw.length, raw.slice && raw.slice(0,50)); //tc-iamunique-tc-package-ds1
    				if('[' === tmp){
    					parse(raw, function(err, msg){
    						if(err || !msg){ return mesh.say({dam: '!', err: "DAM JSON parse error."}, peer) }
    						console.STAT && console.STAT(+new Date, msg.length, '# on hear batch');
    						var P = opt.puff;
    						(function go(){
    							var S = +new Date;
    							var i = 0, m; while(i < P && (m = msg[i++])){ mesh.hear(m, peer); }
    							msg = msg.slice(i); // slicing after is faster than shifting during.
    							console.STAT && console.STAT(S, +new Date - S, 'hear loop');
    							flush(peer); // force send all synchronously batched acks.
    							if(!msg.length){ return }
    							puff(go, 0);
    						}());
    					});
    					raw = ''; // 
    					return;
    				}
    				if('{' === tmp || ((raw['#'] || Object.plain(raw)) && (msg = raw))){
    					if(msg){ return hear.one(msg, peer, S) }
    					parse(raw, function(err, msg){
    						if(err || !msg){ return mesh.say({dam: '!', err: "DAM JSON parse error."}, peer) }
    						hear.one(msg, peer, S);
    					});
    					return;
    				}
    			};
    			hear.one = function(msg, peer, S){ // S here is temporary! Undo.
    				var id, hash, tmp, ash, DBG;
    				if(msg.DBG){ msg.DBG = DBG = {DBG: msg.DBG}; }
    				DBG && (DBG.h = S);
    				DBG && (DBG.hp = +new Date);
    				if(!(id = msg['#'])){ id = msg['#'] = String.random(9); }
    				if(tmp = dup_check(id)){ return }
    				// DAM logic:
    				if(!(hash = msg['##']) && false && u !== msg.put); // disable hashing for now // TODO: impose warning/penalty instead (?)
    				if(hash && (tmp = msg['@'] || (msg.get && id)) && dup.check(ash = tmp+hash)){ return } // Imagine A <-> B <=> (C & D), C & D reply with same ACK but have different IDs, B can use hash to dedup. Or if a GET has a hash already, we shouldn't ACK if same.
    				(msg._ = function(){}).via = mesh.leap = peer;
    				if((tmp = msg['><']) && 'string' == typeof tmp){ tmp.slice(0,99).split(',').forEach(function(k){ this[k] = 1; }, (msg._).yo = {}); } // Peers already sent to, do not resend.
    				// DAM ^
    				if(tmp = msg.dam){
    					if(tmp = mesh.hear[tmp]){
    						tmp(msg, peer, root);
    					}
    					dup_track(id);
    					return;
    				}
    				var S = +new Date;
    				DBG && (DBG.is = S); peer.SI = id;
    				root.on('in', mesh.last = msg);
    				//ECHO = msg.put || ECHO; !(msg.ok !== -3740) && mesh.say({ok: -3740, put: ECHO, '@': msg['#']}, peer);
    				DBG && (DBG.hd = +new Date);
    				console.STAT && console.STAT(S, +new Date - S, msg.get? 'msg get' : msg.put? 'msg put' : 'msg');
    				(tmp = dup_track(id)).via = peer; // don't dedup message ID till after, cause GUN has internal dedup check.
    				if(msg.get){ tmp.it = msg; }
    				if(ash){ dup_track(ash); } //dup.track(tmp+hash, true).it = it(msg);
    				mesh.leap = mesh.last = null; // warning! mesh.leap could be buggy.
    			};
    			hear.c = hear.d = 0;
    (function(){
    				var SMIA = 0;
    				var loop;
    				mesh.hash = function(msg, peer){ var h, s, t;
    					var S = +new Date;
    					json(msg.put, function hash(err, text){
    						var ss = (s || (s = t = text||'')).slice(0, 32768); // 1024 * 32
    					  h = String.hash(ss, h); s = s.slice(32768);
    					  if(s){ puff(hash, 0); return }
    						console.STAT && console.STAT(S, +new Date - S, 'say json+hash');
    					  msg._.$put = t;
    					  msg['##'] = h;
    					  mesh.say(msg, peer);
    					  delete msg._.$put;
    					}, sort);
    				};
    				function sort(k, v){ var tmp;
    					if(!(v instanceof Object)){ return v }
    					Object.keys(v).sort().forEach(sorta, {to: tmp = {}, on: v});
    					return tmp;
    				} function sorta(k){ this.to[k] = this.on[k]; }

    				mesh.say = function(msg, peer){ var tmp;
    					if((tmp = this) && (tmp = tmp.to) && tmp.next){ tmp.next(msg); } // compatible with middleware adapters.
    					if(!msg){ return false }
    					var id, raw, ack = msg['@'];
    //if(opt.super && (!ack || !msg.put)){ return } // TODO: MANHATTAN STUB //OBVIOUSLY BUG! But squelch relay. // :( get only is 100%+ CPU usage :(
    					var meta = msg._||(msg._=function(){});
    					var DBG = msg.DBG, S = +new Date; meta.y = meta.y || S; if(!peer){ DBG && (DBG.y = S); }
    					if(!(id = msg['#'])){ id = msg['#'] = String.random(9); }
    					!loop && dup_track(id);//.it = it(msg); // track for 9 seconds, default. Earth<->Mars would need more! // always track, maybe move this to the 'after' logic if we split function.
    					if(msg.put && (msg.err || (dup.s[id]||'').err)){ return false } // TODO: in theory we should not be able to stun a message, but for now going to check if it can help network performance preventing invalid data to relay.
    					if(!(msg['##']) && u !== msg.put && !meta.via && ack){ mesh.hash(msg, peer); return } // TODO: Should broadcasts be hashed?
    					if(!peer && ack){ peer = ((tmp = dup.s[ack]) && (tmp.via || ((tmp = tmp.it) && (tmp = tmp._) && tmp.via))) || ((tmp = mesh.last) && ack === tmp['#'] && mesh.leap); } // warning! mesh.leap could be buggy! mesh last check reduces this.
    					if(!peer && ack){ // still no peer, then ack daisy chain lost.
    						if(dup.s[ack]){ return } // in dups but no peer hints that this was ack to self, ignore.
    						console.STAT && console.STAT(+new Date, ++SMIA, 'total no peer to ack to');
    						return false;
    					} // TODO: Temporary? If ack via trace has been lost, acks will go to all peers, which trashes browser bandwidth. Not relaying the ack will force sender to ask for ack again. Note, this is technically wrong for mesh behavior.
    					if(!peer && mesh.way){ return mesh.way(msg) }
    					DBG && (DBG.yh = +new Date);
    					if(!(raw = meta.raw)){ mesh.raw(msg, peer); return }
    					DBG && (DBG.yr = +new Date);
    					if(!peer || !peer.id){
    						if(!Object.plain(peer || opt.peers)){ return false }
    						var S = +new Date;
    						opt.puff; var ps = opt.peers, pl = Object.keys(peer || opt.peers || {}); // TODO: .keys( is slow
    						console.STAT && console.STAT(S, +new Date - S, 'peer keys');
    (function go(){
    							var S = +new Date;
    							//Type.obj.map(peer || opt.peers, each); // in case peer is a peer list.
    							loop = 1; var wr = meta.raw; meta.raw = raw; // quick perf hack
    							var i = 0, p; while(i < 9 && (p = (pl||'')[i++])){
    								if(!(p = ps[p])){ continue }
    								mesh.say(msg, p);
    							}
    							meta.raw = wr; loop = 0;
    							pl = pl.slice(i); // slicing after is faster than shifting during.
    							console.STAT && console.STAT(S, +new Date - S, 'say loop');
    							if(!pl.length){ return }
    							puff(go, 0);
    							ack && dup_track(ack); // keep for later
    						}());
    						return;
    					}
    					// TODO: PERF: consider splitting function here, so say loops do less work.
    					if(!peer.wire && mesh.wire){ mesh.wire(peer); }
    					if(id === peer.last){ return } peer.last = id;  // was it just sent?
    					if(peer === meta.via){ return false } // don't send back to self.
    					if((tmp = meta.yo) && (tmp[peer.url] || tmp[peer.pid] || tmp[peer.id]) /*&& !o*/){ return false }
    					console.STAT && console.STAT(S, ((DBG||meta).yp = +new Date) - (meta.y || S), 'say prep');
    					!loop && ack && dup_track(ack); // streaming long responses needs to keep alive the ack.
    					if(peer.batch){
    						peer.tail = (tmp = peer.tail || 0) + raw.length;
    						if(peer.tail <= opt.pack){
    							peer.batch += (tmp?',':'')+raw;
    							return;
    						}
    						flush(peer);
    					}
    					peer.batch = '['; // Prevents double JSON!
    					var ST = +new Date;
    					setTimeout(function(){
    						console.STAT && console.STAT(ST, +new Date - ST, '0ms TO');
    						flush(peer);
    					}, opt.gap); // TODO: queuing/batching might be bad for low-latency video game performance! Allow opt out?
    					send(raw, peer);
    					console.STAT && (ack === peer.SI) && console.STAT(S, +new Date - peer.SH, 'say ack');
    				};
    				mesh.say.c = mesh.say.d = 0;
    				// TODO: this caused a out-of-memory crash!
    				mesh.raw = function(msg, peer){ // TODO: Clean this up / delete it / move logic out!
    					if(!msg){ return '' }
    					var meta = (msg._) || {}, put, tmp;
    					if(tmp = meta.raw){ return tmp }
    					if('string' == typeof msg){ return msg }
    					var hash = msg['##'], ack = msg['@'];
    					if(hash && ack){
    						if(!meta.via && dup_check(ack+hash)){ return false } // for our own out messages, memory & storage may ack the same thing, so dedup that. Tho if via another peer, we already tracked it upon hearing, so this will always trigger false positives, so don't do that!
    						if((tmp = (dup.s[ack]||'').it) || ((tmp = mesh.last) && ack === tmp['#'])){
    							if(hash === tmp['##']){ return false } // if ask has a matching hash, acking is optional.
    							if(!tmp['##']){ tmp['##'] = hash; } // if none, add our hash to ask so anyone we relay to can dedup. // NOTE: May only check against 1st ack chunk, 2nd+ won't know and still stream back to relaying peers which may then dedup. Any way to fix this wasted bandwidth? I guess force rate limiting breaking change, that asking peer has to ask for next lexical chunk.
    						}
    					}
    					if(!msg.dam){
    						var i = 0, to = []; tmp = opt.peers;
    						for(var k in tmp){ var p = tmp[k]; // TODO: Make it up peers instead!
    							to.push(p.url || p.pid || p.id);
    							if(++i > 6){ break }
    						}
    						if(i > 1){ msg['><'] = to.join(); } // TODO: BUG! This gets set regardless of peers sent to! Detect?
    					}
    					if(put = meta.$put){
    						tmp = {}; Object.keys(msg).forEach(function(k){ tmp[k] = msg[k]; });
    						tmp.put = ':])([:';
    						json(tmp, function(err, raw){
    							if(err){ return } // TODO: Handle!!
    							var S = +new Date;
    							tmp = raw.indexOf('"put":":])([:"');
    							res(u, raw = raw.slice(0, tmp+6) + put + raw.slice(tmp + 14));
    							console.STAT && console.STAT(S, +new Date - S, 'say slice');
    						});
    						return;
    					}
    					json(msg, res);
    					function res(err, raw){
    						if(err){ return } // TODO: Handle!!
    						meta.raw = raw; //if(meta && (raw||'').length < (999 * 99)){ meta.raw = raw } // HNPERF: If string too big, don't keep in memory.
    						mesh.say(msg, peer);
    					}
    				};
    			}());

    			function flush(peer){
    				var tmp = peer.batch, t = 'string' == typeof tmp;
    				if(t){ tmp += ']'; }// TODO: Prevent double JSON!
    				peer.batch = peer.tail = null;
    				if(!tmp){ return }
    				if(t? 3 > tmp.length : !tmp.length){ return } // TODO: ^
    				if(!t){try{tmp = (1 === tmp.length? tmp[0] : JSON.stringify(tmp));
    				}catch(e){return opt.log('DAM JSON stringify error', e)}}
    				if(!tmp){ return }
    				send(tmp, peer);
    			}
    			// for now - find better place later.
    			function send(raw, peer){ try{
    				var wire = peer.wire;
    				if(peer.say){
    					peer.say(raw);
    				} else
    				if(wire.send){
    					wire.send(raw);
    				}
    				mesh.say.d += raw.length||0; ++mesh.say.c; // STATS!
    			}catch(e){
    				(peer.queue = peer.queue || []).push(raw);
    			}}

    			mesh.hi = function(peer){
    				var wire = peer.wire, tmp;
    				if(!wire){ mesh.wire((peer.length && {url: peer}) || peer); return }
    				if(peer.id){
    					opt.peers[peer.url || peer.id] = peer;
    				} else {
    					tmp = peer.id = peer.id || String.random(9);
    					mesh.say({dam: '?', pid: root.opt.pid}, opt.peers[tmp] = peer);
    					delete dup.s[peer.last]; // IMPORTANT: see https://gun.eco/docs/DAM#self
    				}
    				peer.met = peer.met || +(new Date);
    				if(!wire.hied){ root.on(wire.hied = 'hi', peer); }
    				// @rogowski I need this here by default for now to fix go1dfish's bug
    				tmp = peer.queue; peer.queue = [];
    				setTimeout.each(tmp||[],function(msg){
    					send(msg, peer);
    				},0,9);
    				//Type.obj.native && Type.obj.native(); // dirty place to check if other JS polluted.
    			};
    			mesh.bye = function(peer){
    				root.on('bye', peer);
    				var tmp = +(new Date); tmp = (tmp - (peer.met||tmp));
    				mesh.bye.time = ((mesh.bye.time || tmp) + tmp) / 2;
    			};
    			mesh.hear['!'] = function(msg, peer){ opt.log('Error:', msg.err); };
    			mesh.hear['?'] = function(msg, peer){
    				if(msg.pid){
    					if(!peer.pid){ peer.pid = msg.pid; }
    					if(msg['@']){ return }
    				}
    				mesh.say({dam: '?', pid: opt.pid, '@': msg['#']}, peer);
    				delete dup.s[peer.last]; // IMPORTANT: see https://gun.eco/docs/DAM#self
    			};

    			root.on('create', function(root){
    				root.opt.pid = root.opt.pid || String.random(9);
    				this.to.next(root);
    				root.on('out', mesh.say);
    			});

    			root.on('bye', function(peer, tmp){
    				peer = opt.peers[peer.id || peer] || peer;
    				this.to.next(peer);
    				peer.bye? peer.bye() : (tmp = peer.wire) && tmp.close && tmp.close();
    				delete opt.peers[peer.id];
    				peer.wire = null;
    			});

    			var gets = {};
    			root.on('bye', function(peer, tmp){ this.to.next(peer);
    				if(tmp = console.STAT){ tmp.peers = (tmp.peers || 0) - 1; }
    				if(!(tmp = peer.url)){ return } gets[tmp] = true;
    				setTimeout(function(){ delete gets[tmp]; },opt.lack || 9000);
    			});
    			root.on('hi', function(peer, tmp){ this.to.next(peer);
    				if(tmp = console.STAT){ tmp.peers = (tmp.peers || 0) + 1; }
    				if(!(tmp = peer.url) || !gets[tmp]){ return } delete gets[tmp];
    				if(opt.super){ return } // temporary (?) until we have better fix/solution?
    				setTimeout.each(Object.keys(root.next), function(soul){ root.next[soul]; // TODO: .keys( is slow
    					tmp = {}; tmp[soul] = root.graph[soul]; tmp = String.hash(tmp); // TODO: BUG! This is broken.
    					mesh.say({'##': tmp, get: {'#': soul}}, peer);
    				});
    			});

    			return mesh;
    		}
    	  var u;

    	  try{ module.exports = Mesh; }catch(e){}

    	})(USE, './mesh');
    USE(function(module){
    		var Gun = USE('../index');
    		Gun.Mesh = USE('./mesh');

    		// TODO: resync upon reconnect online/offline
    		//window.ononline = window.onoffline = function(){ console.log('online?', navigator.onLine) }

    		Gun.on('opt', function(root){
    			this.to.next(root);
    			if(root.once){ return }
    			var opt = root.opt;
    			if(false === opt.WebSocket){ return }

    			var env = Gun.window || {};
    			var websocket = opt.WebSocket || env.WebSocket || env.webkitWebSocket || env.mozWebSocket;
    			if(!websocket){ return }
    			opt.WebSocket = websocket;

    			var mesh = opt.mesh = opt.mesh || Gun.Mesh(root);

    			mesh.wire || opt.wire;
    			mesh.wire = opt.wire = open;
    			function open(peer){ try{
    				if(!peer || !peer.url){ return wire && wire(peer) }
    				var url = peer.url.replace(/^http/, 'ws');
    				var wire = peer.wire = new opt.WebSocket(url);
    				wire.onclose = function(){
    					opt.mesh.bye(peer);
    					reconnect(peer);
    				};
    				wire.onerror = function(error){
    					reconnect(peer);
    				};
    				wire.onopen = function(){
    					opt.mesh.hi(peer);
    				};
    				wire.onmessage = function(msg){
    					if(!msg){ return }
    					opt.mesh.hear(msg.data || msg, peer);
    				};
    				return wire;
    			}catch(e){}}

    			setTimeout(function(){ !opt.super && root.on('out', {dam:'hi'}); },1); // it can take a while to open a socket, so maybe no longer lazy load for perf reasons?

    			var wait = 2 * 999;
    			function reconnect(peer){
    				clearTimeout(peer.defer);
    				if(!opt.peers[peer.url]){ return }
    				if(doc && peer.retry <= 0){ return }
    				peer.retry = (peer.retry || opt.retry+1 || 60) - ((-peer.tried + (peer.tried = +new Date) < wait*4)?1:0);
    				peer.defer = setTimeout(function to(){
    					if(doc && doc.hidden){ return setTimeout(to,wait) }
    					open(peer);
    				}, wait);
    			}
    			var doc = (''+u !== typeof document) && document;
    		});
    		var u;
    	})(USE, './websocket');
    USE(function(module){
    		if(typeof Gun === 'undefined'){ return }

    		var noop = function(){}, store;
    		try{store = (Gun.window||noop).localStorage;}catch(e){}
    		if(!store){
    			Gun.log("Warning: No localStorage exists to persist data to!");
    			store = {setItem: function(k,v){this[k]=v;}, removeItem: function(k){delete this[k];}, getItem: function(k){return this[k]}};
    		}
    		var json = JSON.stringifyAsync || function(v,cb,r,s){ var u; try{ cb(u, JSON.stringify(v,r,s)); }catch(e){ cb(e); } };

    		Gun.on('create', function lg(root){
    			this.to.next(root);
    			var opt = root.opt; root.graph; var acks = [], disk, to, size, stop;
    			if(false === opt.localStorage){ return }
    			opt.prefix = opt.file || 'gun/';
    			try{ disk = lg[opt.prefix] = lg[opt.prefix] || JSON.parse(size = store.getItem(opt.prefix)) || {}; // TODO: Perf! This will block, should we care, since limited to 5MB anyways?
    			}catch(e){ disk = lg[opt.prefix] = {}; }
    			size = (size||'').length;

    			root.on('get', function(msg){
    				this.to.next(msg);
    				var lex = msg.get, soul, data, tmp, u;
    				if(!lex || !(soul = lex['#'])){ return }
    				data = disk[soul] || u;
    				if(data && (tmp = lex['.']) && !Object.plain(tmp)){ // pluck!
    					data = Gun.state.ify({}, tmp, Gun.state.is(data, tmp), data[tmp], soul);
    				}
    				//if(data){ (tmp = {})[soul] = data } // back into a graph.
    				//setTimeout(function(){
    				Gun.on.get.ack(msg, data); //root.on('in', {'@': msg['#'], put: tmp, lS:1});// || root.$});
    				//}, Math.random() * 10); // FOR TESTING PURPOSES!
    			});

    			root.on('put', function(msg){
    				this.to.next(msg); // remember to call next middleware adapter
    				var put = msg.put, soul = put['#'], key = put['.'], id = msg['#']; // pull data off wire envelope
    				disk[soul] = Gun.state.ify(disk[soul], key, put['>'], put[':'], soul); // merge into disk object
    				if(stop && size > (4999880)){ root.on('in', {'@': id, err: "localStorage max!"}); return; }
    				if(!msg['@']){ acks.push(id); } // then ack any non-ack write. // TODO: use batch id.
    				if(to){ return }
    				to = setTimeout(flush, 9+(size / 333)); // 0.1MB = 0.3s, 5MB = 15s 
    			});
    			function flush(){
    				if(!acks.length && ((setTimeout.turn||'').s||'').length){ setTimeout(flush,99); return; } // defer if "busy" && no saves.
    				var ack = acks; clearTimeout(to); to = false; acks = [];
    				json(disk, function(err, tmp){
    					try{!err && store.setItem(opt.prefix, tmp);
    					}catch(e){ err = stop = e || "localStorage failure"; }
    					if(err){
    						Gun.log(err + " Consider using GUN's IndexedDB plugin for RAD for more storage space, https://gun.eco/docs/RAD#install");
    						root.on('localStorage:error', {err: err, get: opt.prefix, put: disk});
    					}
    					size = tmp.length;

    					if(!err && !Object.empty(opt.peers)){ return } // only ack if there are no peers. // Switch this to probabilistic mode
    					setTimeout.each(ack, function(id){
    						root.on('in', {'@': id, err: err, ok: 0}); // localStorage isn't reliable, so make its `ok` code be a low number.
    					},0,99);
    				});
    			}
    		
    		});
    	})(USE, './localStorage');

    }());
    (function(){
    	var u;
    	if(''+u == typeof Gun){ return }
    	var DEP = function(n){ console.warn("Warning! Deprecated internal utility will break in next version:", n); };
    	// Generic javascript utilities.
    	var Type = Gun;
    	//Type.fns = Type.fn = {is: function(fn){ return (!!fn && fn instanceof Function) }}
    	Type.fn = Type.fn || {is: function(fn){ DEP('fn'); return (!!fn && 'function' == typeof fn) }};
    	Type.bi = Type.bi || {is: function(b){ DEP('bi');return (b instanceof Boolean || typeof b == 'boolean') }};
    	Type.num = Type.num || {is: function(n){ DEP('num'); return !list_is(n) && ((n - parseFloat(n) + 1) >= 0 || Infinity === n || -Infinity === n) }};
    	Type.text = Type.text || {is: function(t){ DEP('text'); return (typeof t == 'string') }};
    	Type.text.ify = Type.text.ify || function(t){ DEP('text.ify');
    		if(Type.text.is(t)){ return t }
    		if(typeof JSON !== "undefined"){ return JSON.stringify(t) }
    		return (t && t.toString)? t.toString() : t;
    	};
    	Type.text.random = Type.text.random || function(l, c){ DEP('text.random');
    		var s = '';
    		l = l || 24; // you are not going to make a 0 length random number, so no need to check type
    		c = c || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXZabcdefghijklmnopqrstuvwxyz';
    		while(l > 0){ s += c.charAt(Math.floor(Math.random() * c.length)); l--; }
    		return s;
    	};
    	Type.text.match = Type.text.match || function(t, o){ var tmp, u; DEP('text.match');
    		if('string' !== typeof t){ return false }
    		if('string' == typeof o){ o = {'=': o}; }
    		o = o || {};
    		tmp = (o['='] || o['*'] || o['>'] || o['<']);
    		if(t === tmp){ return true }
    		if(u !== o['=']){ return false }
    		tmp = (o['*'] || o['>'] || o['<']);
    		if(t.slice(0, (tmp||'').length) === tmp){ return true }
    		if(u !== o['*']){ return false }
    		if(u !== o['>'] && u !== o['<']){
    			return (t >= o['>'] && t <= o['<'])? true : false;
    		}
    		if(u !== o['>'] && t >= o['>']){ return true }
    		if(u !== o['<'] && t <= o['<']){ return true }
    		return false;
    	};
    	Type.text.hash = Type.text.hash || function(s, c){ // via SO
    		DEP('text.hash');
    		if(typeof s !== 'string'){ return }
    	  c = c || 0;
    	  if(!s.length){ return c }
    	  for(var i=0,l=s.length,n; i<l; ++i){
    	    n = s.charCodeAt(i);
    	    c = ((c<<5)-c)+n;
    	    c |= 0;
    	  }
    	  return c;
    	};
    	Type.list = Type.list || {is: function(l){ DEP('list'); return (l instanceof Array) }};
    	Type.list.slit = Type.list.slit || Array.prototype.slice;
    	Type.list.sort = Type.list.sort || function(k){ // creates a new sort function based off some key
    		DEP('list.sort');
    		return function(A,B){
    			if(!A || !B){ return 0 } A = A[k]; B = B[k];
    			if(A < B){ return -1 }else if(A > B){ return 1 }
    			else { return 0 }
    		}
    	};
    	Type.list.map = Type.list.map || function(l, c, _){ DEP('list.map'); return obj_map(l, c, _) };
    	Type.list.index = 1; // change this to 0 if you want non-logical, non-mathematical, non-matrix, non-convenient array notation
    	Type.obj = Type.boj || {is: function(o){ DEP('obj'); return o? (o instanceof Object && o.constructor === Object) || Object.prototype.toString.call(o).match(/^\[object (\w+)\]$/)[1] === 'Object' : false }};
    	Type.obj.put = Type.obj.put || function(o, k, v){ DEP('obj.put'); return (o||{})[k] = v, o };
    	Type.obj.has = Type.obj.has || function(o, k){ DEP('obj.has'); return o && Object.prototype.hasOwnProperty.call(o, k) };
    	Type.obj.del = Type.obj.del || function(o, k){ DEP('obj.del'); 
    		if(!o){ return }
    		o[k] = null;
    		delete o[k];
    		return o;
    	};
    	Type.obj.as = Type.obj.as || function(o, k, v, u){ DEP('obj.as'); return o[k] = o[k] || (u === v? {} : v) };
    	Type.obj.ify = Type.obj.ify || function(o){ DEP('obj.ify'); 
    		if(obj_is(o)){ return o }
    		try{o = JSON.parse(o);
    		}catch(e){o={};}		return o;
    	}
    	;(function(){ var u;
    		function map(v,k){
    			if(obj_has(this,k) && u !== this[k]){ return }
    			this[k] = v;
    		}
    		Type.obj.to = Type.obj.to || function(from, to){ DEP('obj.to'); 
    			to = to || {};
    			obj_map(from, map, to);
    			return to;
    		};
    	}());
    	Type.obj.copy = Type.obj.copy || function(o){ DEP('obj.copy'); // because http://web.archive.org/web/20140328224025/http://jsperf.com/cloning-an-object/2
    		return !o? o : JSON.parse(JSON.stringify(o)); // is shockingly faster than anything else, and our data has to be a subset of JSON anyways!
    	}
    	;(function(){
    		function empty(v,i){ var n = this.n, u;
    			if(n && (i === n || (obj_is(n) && obj_has(n, i)))){ return }
    			if(u !== i){ return true }
    		}
    		Type.obj.empty = Type.obj.empty || function(o, n){ DEP('obj.empty'); 
    			if(!o){ return true }
    			return obj_map(o,empty,{n:n})? false : true;
    		};
    	}());
    (function(){
    		function t(k,v){
    			if(2 === arguments.length){
    				t.r = t.r || {};
    				t.r[k] = v;
    				return;
    			} t.r = t.r || [];
    			t.r.push(k);
    		}		var keys = Object.keys, map;
    		Object.keys = Object.keys || function(o){ return map(o, function(v,k,t){t(k);}) };
    		Type.obj.map = map = Type.obj.map || function(l, c, _){ DEP('obj.map'); 
    			var u, i = 0, x, r, ll, lle, f = 'function' == typeof c;
    			t.r = u;
    			if(keys && obj_is(l)){
    				ll = keys(l); lle = true;
    			}
    			_ = _ || {};
    			if(list_is(l) || ll){
    				x = (ll || l).length;
    				for(;i < x; i++){
    					var ii = (i + Type.list.index);
    					if(f){
    						r = lle? c.call(_, l[ll[i]], ll[i], t) : c.call(_, l[i], ii, t);
    						if(r !== u){ return r }
    					} else {
    						//if(Type.test.is(c,l[i])){ return ii } // should implement deep equality testing!
    						if(c === l[lle? ll[i] : i]){ return ll? ll[i] : ii } // use this for now
    					}
    				}
    			} else {
    				for(i in l){
    					if(f){
    						if(obj_has(l,i)){
    							r = _? c.call(_, l[i], i, t) : c(l[i], i, t);
    							if(r !== u){ return r }
    						}
    					} else {
    						//if(a.test.is(c,l[i])){ return i } // should implement deep equality testing!
    						if(c === l[i]){ return i } // use this for now
    					}
    				}
    			}
    			return f? t.r : Type.list.index? 0 : -1;
    		};
    	}());
    	Type.time = Type.time || {};
    	Type.time.is = Type.time.is || function(t){ DEP('time'); return t? t instanceof Date : (+new Date().getTime()) };

    	var fn_is = Type.fn.is;
    	var list_is = Type.list.is;
    	var obj = Type.obj, obj_is = obj.is, obj_has = obj.has, obj_map = obj.map;

    	var Val = {};
    	Val.is = function(v){ DEP('val.is'); // Valid values are a subset of JSON: null, binary, number (!Infinity), text, or a soul relation. Arrays need special algorithms to handle concurrency, so they are not supported directly. Use an extension that supports them if needed but research their problems first.
    		if(v === u){ return false }
    		if(v === null){ return true } // "deletes", nulling out keys.
    		if(v === Infinity){ return false } // we want this to be, but JSON does not support it, sad face.
    		if(text_is(v) // by "text" we mean strings.
    		|| bi_is(v) // by "binary" we mean boolean.
    		|| num_is(v)){ // by "number" we mean integers or decimals.
    			return true; // simple values are valid.
    		}
    		return Val.link.is(v) || false; // is the value a soul relation? Then it is valid and return it. If not, everything else remaining is an invalid data type. Custom extensions can be built on top of these primitives to support other types.
    	};
    	Val.link = Val.rel = {_: '#'};
    (function(){
    		Val.link.is = function(v){ DEP('val.link.is'); // this defines whether an object is a soul relation or not, they look like this: {'#': 'UUID'}
    			if(v && v[rel_] && !v._ && obj_is(v)){ // must be an object.
    				var o = {};
    				obj_map(v, map, o);
    				if(o.id){ // a valid id was found.
    					return o.id; // yay! Return it.
    				}
    			}
    			return false; // the value was not a valid soul relation.
    		};
    		function map(s, k){ var o = this; // map over the object...
    			if(o.id){ return o.id = false } // if ID is already defined AND we're still looping through the object, it is considered invalid.
    			if(k == rel_ && text_is(s)){ // the key should be '#' and have a text value.
    				o.id = s; // we found the soul!
    			} else {
    				return o.id = false; // if there exists anything else on the object that isn't the soul, then it is considered invalid.
    			}
    		}
    	}());
    	Val.link.ify = function(t){ DEP('val.link.ify'); return obj_put({}, rel_, t) }; // convert a soul into a relation and return it.
    	Type.obj.has._ = '.';
    	var rel_ = Val.link._, u;
    	var bi_is = Type.bi.is;
    	var num_is = Type.num.is;
    	var text_is = Type.text.is;
    	var obj = Type.obj, obj_is = obj.is, obj_put = obj.put, obj_map = obj.map;

    	Type.val = Type.val || Val;

    	var Node = {_: '_'};
    	Node.soul = function(n, o){ DEP('node.soul'); return (n && n._ && n._[o || soul_]) }; // convenience function to check to see if there is a soul on a node and return it.
    	Node.soul.ify = function(n, o){ DEP('node.soul.ify'); // put a soul on an object.
    		o = (typeof o === 'string')? {soul: o} : o || {};
    		n = n || {}; // make sure it exists.
    		n._ = n._ || {}; // make sure meta exists.
    		n._[soul_] = o.soul || n._[soul_] || text_random(); // put the soul on it.
    		return n;
    	};
    	Node.soul._ = Val.link._;
    (function(){
    		Node.is = function(n, cb, as){ DEP('node.is'); var s; // checks to see if an object is a valid node.
    			if(!obj_is(n)){ return false } // must be an object.
    			if(s = Node.soul(n)){ // must have a soul on it.
    				return !obj_map(n, map, {as:as,cb:cb,s:s,n:n});
    			}
    			return false; // nope! This was not a valid node.
    		};
    		function map(v, k){ // we invert this because the way we check for this is via a negation.
    			if(k === Node._){ return } // skip over the metadata.
    			if(!Val.is(v)){ return true } // it is true that this is an invalid node.
    			if(this.cb){ this.cb.call(this.as, v, k, this.n, this.s); } // optionally callback each key/value.
    		}
    	}());
    (function(){
    		Node.ify = function(obj, o, as){ DEP('node.ify'); // returns a node from a shallow object.
    			if(!o){ o = {}; }
    			else if(typeof o === 'string'){ o = {soul: o}; }
    			else if('function' == typeof o){ o = {map: o}; }
    			if(o.map){ o.node = o.map.call(as, obj, u, o.node || {}); }
    			if(o.node = Node.soul.ify(o.node || {}, o)){
    				obj_map(obj, map, {o:o,as:as});
    			}
    			return o.node; // This will only be a valid node if the object wasn't already deep!
    		};
    		function map(v, k){ var o = this.o, tmp, u; // iterate over each key/value.
    			if(o.map){
    				tmp = o.map.call(this.as, v, ''+k, o.node);
    				if(u === tmp){
    					obj_del(o.node, k);
    				} else
    				if(o.node){ o.node[k] = tmp; }
    				return;
    			}
    			if(Val.is(v)){
    				o.node[k] = v;
    			}
    		}
    	}());
    	var obj = Type.obj, obj_is = obj.is, obj_del = obj.del, obj_map = obj.map;
    	var text = Type.text, text_random = text.random;
    	var soul_ = Node.soul._;
    	var u;
    	Type.node = Type.node || Node;

    	var State = Type.state;
    	State.lex = function(){ DEP('state.lex'); return State().toString(36).replace('.','') };
    	State.to = function(from, k, to){ DEP('state.to'); 
    		var val = (from||{})[k];
    		if(obj_is(val)){
    			val = obj_copy(val);
    		}
    		return State.ify(to, k, State.is(from, k), val, Node.soul(from));
    	}
    	;(function(){
    		State.map = function(cb, s, as){ DEP('state.map'); var u; // for use with Node.ify
    			var o = obj_is(o = cb || s)? o : null;
    			cb = fn_is(cb = cb || s)? cb : null;
    			if(o && !cb){
    				s = num_is(s)? s : State();
    				o[N_] = o[N_] || {};
    				obj_map(o, map, {o:o,s:s});
    				return o;
    			}
    			as = as || obj_is(s)? s : u;
    			s = num_is(s)? s : State();
    			return function(v, k, o, opt){
    				if(!cb){
    					map.call({o: o, s: s}, v,k);
    					return v;
    				}
    				cb.call(as || this || {}, v, k, o, opt);
    				if(obj_has(o,k) && u === o[k]){ return }
    				map.call({o: o, s: s}, v,k);
    			}
    		};
    		function map(v,k){
    			if(N_ === k){ return }
    			State.ify(this.o, k, this.s) ;
    		}
    	}());
    	var obj = Type.obj; obj.as; var obj_has = obj.has, obj_is = obj.is, obj_map = obj.map, obj_copy = obj.copy;
    	var num = Type.num, num_is = num.is;
    	var fn = Type.fn, fn_is = fn.is;
    	var N_ = Node._, u;

    	var Graph = {};
    (function(){
    		Graph.is = function(g, cb, fn, as){ DEP('graph.is'); // checks to see if an object is a valid graph.
    			if(!g || !obj_is(g) || obj_empty(g)){ return false } // must be an object.
    			return !obj_map(g, map, {cb:cb,fn:fn,as:as}); // makes sure it wasn't an empty object.
    		};
    		function map(n, s){ // we invert this because the way'? we check for this is via a negation.
    			if(!n || s !== Node.soul(n) || !Node.is(n, this.fn, this.as)){ return true } // it is true that this is an invalid graph.
    			if(!this.cb){ return }
    			nf.n = n; nf.as = this.as; // sequential race conditions aren't races.
    			this.cb.call(nf.as, n, s, nf);
    		}
    		function nf(fn){ // optional callback for each node.
    			if(fn){ Node.is(nf.n, fn, nf.as); } // where we then have an optional callback for each key/value.
    		}
    	}());
    (function(){
    		Graph.ify = function(obj, env, as){ DEP('graph.ify'); 
    			var at = {path: [], obj: obj};
    			if(!env){
    				env = {};
    			} else
    			if(typeof env === 'string'){
    				env = {soul: env};
    			} else
    			if('function' == typeof env){
    				env.map = env;
    			}
    			if(typeof as === 'string'){
    				env.soul = env.soul || as;
    				as = u;
    			}
    			if(env.soul){
    				at.link = Val.link.ify(env.soul);
    			}
    			env.shell = (as||{}).shell;
    			env.graph = env.graph || {};
    			env.seen = env.seen || [];
    			env.as = env.as || as;
    			node(env, at);
    			env.root = at.node;
    			return env.graph;
    		};
    		function node(env, at){ var tmp;
    			if(tmp = seen(env, at)){ return tmp }
    			at.env = env;
    			at.soul = soul;
    			if(Node.ify(at.obj, map, at)){
    				at.link = at.link || Val.link.ify(Node.soul(at.node));
    				if(at.obj !== env.shell){
    					env.graph[Val.link.is(at.link)] = at.node;
    				}
    			}
    			return at;
    		}
    		function map(v,k,n){
    			var at = this, env = at.env, is, tmp;
    			if(Node._ === k && obj_has(v,Val.link._)){
    				return n._; // TODO: Bug?
    			}
    			if(!(is = valid(v,k,n, at,env))){ return }
    			if(!k){
    				at.node = at.node || n || {};
    				if(obj_has(v, Node._) && Node.soul(v)){ // ? for safety ?
    					at.node._ = obj_copy(v._);
    				}
    				at.node = Node.soul.ify(at.node, Val.link.is(at.link));
    				at.link = at.link || Val.link.ify(Node.soul(at.node));
    			}
    			if(tmp = env.map){
    				tmp.call(env.as || {}, v,k,n, at);
    				if(obj_has(n,k)){
    					v = n[k];
    					if(u === v){
    						obj_del(n, k);
    						return;
    					}
    					if(!(is = valid(v,k,n, at,env))){ return }
    				}
    			}
    			if(!k){ return at.node }
    			if(true === is){
    				return v;
    			}
    			tmp = node(env, {obj: v, path: at.path.concat(k)});
    			if(!tmp.node){ return }
    			return tmp.link; //{'#': Node.soul(tmp.node)};
    		}
    		function soul(id){ var at = this;
    			var prev = Val.link.is(at.link), graph = at.env.graph;
    			at.link = at.link || Val.link.ify(id);
    			at.link[Val.link._] = id;
    			if(at.node && at.node[Node._]){
    				at.node[Node._][Val.link._] = id;
    			}
    			if(obj_has(graph, prev)){
    				graph[id] = graph[prev];
    				obj_del(graph, prev);
    			}
    		}
    		function valid(v,k,n, at,env){ var tmp;
    			if(Val.is(v)){ return true }
    			if(obj_is(v)){ return 1 }
    			if(tmp = env.invalid){
    				v = tmp.call(env.as || {}, v,k,n);
    				return valid(v,k,n, at,env);
    			}
    			env.err = "Invalid value at '" + at.path.concat(k).join('.') + "'!";
    			if(Type.list.is(v)){ env.err += " Use `.set(item)` instead of an Array."; }
    		}
    		function seen(env, at){
    			var arr = env.seen, i = arr.length, has;
    			while(i--){ has = arr[i];
    				if(at.obj === has.obj){ return has }
    			}
    			arr.push(at);
    		}
    	}());
    	Graph.node = function(node){ DEP('graph.node'); 
    		var soul = Node.soul(node);
    		if(!soul){ return }
    		return obj_put({}, soul, node);
    	}
    	;(function(){
    		Graph.to = function(graph, root, opt){ DEP('graph.to'); 
    			if(!graph){ return }
    			var obj = {};
    			opt = opt || {seen: {}};
    			obj_map(graph[root], map, {obj:obj, graph: graph, opt: opt});
    			return obj;
    		};
    		function map(v,k){ var tmp, obj;
    			if(Node._ === k){
    				if(obj_empty(v, Val.link._)){
    					return;
    				}
    				this.obj[k] = obj_copy(v);
    				return;
    			}
    			if(!(tmp = Val.link.is(v))){
    				this.obj[k] = v;
    				return;
    			}
    			if(obj = this.opt.seen[tmp]){
    				this.obj[k] = obj;
    				return;
    			}
    			this.obj[k] = this.opt.seen[tmp] = Graph.to(this.graph, tmp, this.opt);
    		}
    	}());
    	var fn_is = Type.fn.is;
    	var obj = Type.obj, obj_is = obj.is, obj_del = obj.del, obj_has = obj.has, obj_empty = obj.empty, obj_put = obj.put, obj_map = obj.map, obj_copy = obj.copy;
    	var u;
    	Type.graph = Type.graph || Graph;
    }());
    });

    (function(){
    	var Gun = (typeof window !== "undefined")? window.Gun : gun$1;

    	Gun.on('opt', function(root){
    		this.to.next(root);
    		var opt = root.opt;
    		if(root.once){ return }
    		if(!Gun.Mesh){ return }
    		if(false === opt.RTCPeerConnection){ return }

    		var env;
    		if(typeof window !== "undefined"){ env = window; }
    		if(typeof commonjsGlobal !== "undefined"){ env = commonjsGlobal; }
    		env = env || {};

    		var rtcpc = opt.RTCPeerConnection || env.RTCPeerConnection || env.webkitRTCPeerConnection || env.mozRTCPeerConnection;
    		var rtcsd = opt.RTCSessionDescription || env.RTCSessionDescription || env.webkitRTCSessionDescription || env.mozRTCSessionDescription;
    		var rtcic = opt.RTCIceCandidate || env.RTCIceCandidate || env.webkitRTCIceCandidate || env.mozRTCIceCandidate;
    		if(!rtcpc || !rtcsd || !rtcic){ return }
    		opt.RTCPeerConnection = rtcpc;
    		opt.RTCSessionDescription = rtcsd;
    		opt.RTCIceCandidate = rtcic;
    		opt.rtc = opt.rtc || {'iceServers': [
          {urls: 'stun:stun.l.google.com:19302'},
          {urls: "stun:stun.sipgate.net:3478"}/*,
          {urls: "stun:stun.stunprotocol.org"},
          {urls: "stun:stun.sipgate.net:10000"},
          {urls: "stun:217.10.68.152:10000"},
          {urls: 'stun:stun.services.mozilla.com'}*/ 
        ]};
        // TODO: Select the most appropriate stuns. 
        // FIXME: Find the wire throwing ICE Failed
        // The above change corrects at least firefox RTC Peer handler where it **throws** on over 6 ice servers, and updates url: to urls: removing deprecation warning 
        opt.rtc.dataChannel = opt.rtc.dataChannel || {ordered: false, maxRetransmits: 2};
        opt.rtc.sdp = opt.rtc.sdp || {mandatory: {OfferToReceiveAudio: false, OfferToReceiveVideo: false}};
        opt.announce = function(to){
    			root.on('out', {rtc: {id: opt.pid, to:to}}); // announce ourself
        };
    		var mesh = opt.mesh = opt.mesh || Gun.Mesh(root);
    		root.on('create', function(at){
    			this.to.next(at);
    			setTimeout(opt.announce, 1);
    		});
    		root.on('in', function(msg){
    			if(msg.rtc){ open(msg); }
    			this.to.next(msg);
    		});

    		function open(msg){
    			var rtc = msg.rtc, peer, tmp;
    			if(!rtc || !rtc.id){ return }
    			delete opt.announce[rtc.id]; /// remove after connect
    			if(tmp = rtc.answer){
    				if(!(peer = opt.peers[rtc.id] || open[rtc.id]) || peer.remoteSet){ return }
    				tmp.sdp = tmp.sdp.replace(/\\r\\n/g, '\r\n');
    				return peer.setRemoteDescription(peer.remoteSet = new opt.RTCSessionDescription(tmp)); 
    			}
    			if(tmp = rtc.candidate){
    				peer = opt.peers[rtc.id] || open[rtc.id] || open({rtc: {id: rtc.id}});
    				return peer.addIceCandidate(new opt.RTCIceCandidate(tmp));
    			}
    			//if(opt.peers[rtc.id]){ return }
    			if(open[rtc.id]){ return }
    			(peer = new opt.RTCPeerConnection(opt.rtc)).id = rtc.id;
    			var wire = peer.wire = peer.createDataChannel('dc', opt.rtc.dataChannel);
    			open[rtc.id] = peer;
    			wire.onclose = function(){
    				delete open[rtc.id];
    				mesh.bye(peer);
    				//reconnect(peer);
    			};
    			wire.onerror = function(err){};
    			wire.onopen = function(e){
    				//delete open[rtc.id];
    				mesh.hi(peer);
    			};
    			wire.onmessage = function(msg){
    				if(!msg){ return }
    				mesh.hear(msg.data || msg, peer);
    			};
    			peer.onicecandidate = function(e){ // source: EasyRTC!
            if(!e.candidate){ return }
            root.on('out', {'@': msg['#'], rtc: {candidate: e.candidate, id: opt.pid}});
    			};
    			peer.ondatachannel = function(e){
    				var rc = e.channel;
    				rc.onmessage = wire.onmessage;
    				rc.onopen = wire.onopen;
    				rc.onclose = wire.onclose;
    			};
    			if(tmp = rtc.offer){
    				rtc.offer.sdp = rtc.offer.sdp.replace(/\\r\\n/g, '\r\n');
    				peer.setRemoteDescription(new opt.RTCSessionDescription(tmp)); 
    				peer.createAnswer(function(answer){
    					peer.setLocalDescription(answer);
    					root.on('out', {'@': msg['#'], rtc: {answer: answer, id: opt.pid}});
    				}, function(){}, opt.rtc.sdp);
    				return;
    			}
    			peer.createOffer(function(offer){
    				peer.setLocalDescription(offer);
    				root.on('out', {'@': msg['#'], rtc: {offer: offer, id: opt.pid}});
    			}, function(){}, opt.rtc.sdp);
    			return peer;
    		}
    	});
    }());

    let peers;

    if (process.env.NODE_ENV === "development") {
      peers = ["http://localhost:8765/gun"];
    } else {
      peers = [
        // Community relay peers: https://github.com/amark/gun/wiki/volunteer.dht
        "https://www.raygun.live/gun",
        "https://gunmeetingserver.herokuapp.com/gun",
        "https://gun-us.herokuapp.com/gun",
        "https://gun-eu.herokuapp.com/gun",
        // My own relay peer
        // "https://phrassed.com/gun",
      ];
    }

    const gun = new gun$1({
      peers,
    });

    // attaching gun to window for testing purposes
    window.gun = gun;

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }
    function quintOut(t) {
        return --t * t * t * t * t + 1;
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function crossfade(_a) {
        var { fallback } = _a, defaults = __rest(_a, ["fallback"]);
        const to_receive = new Map();
        const to_send = new Map();
        function crossfade(from, node, params) {
            const { delay = 0, duration = d => Math.sqrt(d) * 30, easing = cubicOut } = assign(assign({}, defaults), params);
            const to = node.getBoundingClientRect();
            const dx = from.left - to.left;
            const dy = from.top - to.top;
            const dw = from.width / to.width;
            const dh = from.height / to.height;
            const d = Math.sqrt(dx * dx + dy * dy);
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            const opacity = +style.opacity;
            return {
                delay,
                duration: is_function(duration) ? duration(d) : duration,
                easing,
                css: (t, u) => `
				opacity: ${t * opacity};
				transform-origin: top left;
				transform: ${transform} translate(${u * dx}px,${u * dy}px) scale(${t + (1 - t) * dw}, ${t + (1 - t) * dh});
			`
            };
        }
        function transition(items, counterparts, intro) {
            return (node, params) => {
                items.set(params.key, {
                    rect: node.getBoundingClientRect()
                });
                return () => {
                    if (counterparts.has(params.key)) {
                        const { rect } = counterparts.get(params.key);
                        counterparts.delete(params.key);
                        return crossfade(rect, node, params);
                    }
                    // if the node is disappearing altogether
                    // (i.e. wasn't claimed by the other list)
                    // then we need to supply an outro
                    items.delete(params.key);
                    return fallback && fallback(node, params, intro);
                };
            };
        }
        return [
            transition(to_send, to_receive, false),
            transition(to_receive, to_send, true)
        ];
    }

    /* src\ScrollToBottom.svelte generated by Svelte v3.48.0 */
    const file$8 = "src\\ScrollToBottom.svelte";

    function create_fragment$9(ctx) {
    	let div;
    	let button;
    	let div_intro;
    	let div_outro;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "↓";
    			attr_dev(button, "class", "svelte-1co9mdl");
    			add_location(button, file$8, 6, 2, 163);
    			attr_dev(div, "class", "svelte-1co9mdl");
    			add_location(div, file$8, 5, 0, 86);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					prevent_default(function () {
    						if (is_function(/*onScroll*/ ctx[0])) /*onScroll*/ ctx[0].apply(this, arguments);
    					}),
    					false,
    					true,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, fly, { x: 20, duration: 200 });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, fly, { x: 20, duration: 200 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_outro) div_outro.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ScrollToBottom', slots, []);
    	let { onScroll } = $$props;
    	const writable_props = ['onScroll'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ScrollToBottom> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('onScroll' in $$props) $$invalidate(0, onScroll = $$props.onScroll);
    	};

    	$$self.$capture_state = () => ({ fly, onScroll });

    	$$self.$inject_state = $$props => {
    		if ('onScroll' in $$props) $$invalidate(0, onScroll = $$props.onScroll);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [onScroll];
    }

    class ScrollToBottom extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { onScroll: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ScrollToBottom",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onScroll*/ ctx[0] === undefined && !('onScroll' in props)) {
    			console.warn("<ScrollToBottom> was created without expected prop 'onScroll'");
    		}
    	}

    	get onScroll() {
    		throw new Error("<ScrollToBottom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onScroll(value) {
    		throw new Error("<ScrollToBottom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\ui\Input.svelte generated by Svelte v3.48.0 */
    const file$7 = "src\\ui\\Input.svelte";

    // (57:2) {:else}
    function create_else_block(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			input.disabled = /*disabled*/ ctx[6];
    			attr_dev(input, "rows", /*rows*/ ctx[8]);
    			attr_dev(input, "class", "input svelte-c4fbvv");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "maxlength", /*maxLength*/ ctx[5]);
    			attr_dev(input, "name", /*name*/ ctx[4]);
    			attr_dev(input, "aria-labelledby", /*ariaLabelledBy*/ ctx[1]);
    			attr_dev(input, "aria-label", /*ariaLabel*/ ctx[2]);
    			attr_dev(input, "placeholder", /*placeholder*/ ctx[3]);
    			add_location(input, file$7, 57, 4, 1562);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[11]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*disabled*/ 64) {
    				prop_dev(input, "disabled", /*disabled*/ ctx[6]);
    			}

    			if (dirty & /*rows*/ 256) {
    				attr_dev(input, "rows", /*rows*/ ctx[8]);
    			}

    			if (dirty & /*maxLength*/ 32) {
    				attr_dev(input, "maxlength", /*maxLength*/ ctx[5]);
    			}

    			if (dirty & /*name*/ 16) {
    				attr_dev(input, "name", /*name*/ ctx[4]);
    			}

    			if (dirty & /*ariaLabelledBy*/ 2) {
    				attr_dev(input, "aria-labelledby", /*ariaLabelledBy*/ ctx[1]);
    			}

    			if (dirty & /*ariaLabel*/ 4) {
    				attr_dev(input, "aria-label", /*ariaLabel*/ ctx[2]);
    			}

    			if (dirty & /*placeholder*/ 8) {
    				attr_dev(input, "placeholder", /*placeholder*/ ctx[3]);
    			}

    			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(57:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {#if multiline}
    function create_if_block_1$3(ctx) {
    	let textarea;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			textarea.disabled = /*disabled*/ ctx[6];
    			attr_dev(textarea, "rows", /*rows*/ ctx[8]);
    			attr_dev(textarea, "class", "input svelte-c4fbvv");
    			attr_dev(textarea, "type", "text");
    			attr_dev(textarea, "maxlength", /*maxLength*/ ctx[5]);
    			attr_dev(textarea, "name", /*name*/ ctx[4]);
    			attr_dev(textarea, "aria-labelledby", /*ariaLabelledBy*/ ctx[1]);
    			attr_dev(textarea, "aria-label", /*ariaLabel*/ ctx[2]);
    			attr_dev(textarea, "placeholder", /*placeholder*/ ctx[3]);
    			add_location(textarea, file$7, 43, 4, 1292);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    			set_input_value(textarea, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[10]),
    					listen_dev(textarea, "keypress", handleKeyPress, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*disabled*/ 64) {
    				prop_dev(textarea, "disabled", /*disabled*/ ctx[6]);
    			}

    			if (dirty & /*rows*/ 256) {
    				attr_dev(textarea, "rows", /*rows*/ ctx[8]);
    			}

    			if (dirty & /*maxLength*/ 32) {
    				attr_dev(textarea, "maxlength", /*maxLength*/ ctx[5]);
    			}

    			if (dirty & /*name*/ 16) {
    				attr_dev(textarea, "name", /*name*/ ctx[4]);
    			}

    			if (dirty & /*ariaLabelledBy*/ 2) {
    				attr_dev(textarea, "aria-labelledby", /*ariaLabelledBy*/ ctx[1]);
    			}

    			if (dirty & /*ariaLabel*/ 4) {
    				attr_dev(textarea, "aria-label", /*ariaLabel*/ ctx[2]);
    			}

    			if (dirty & /*placeholder*/ 8) {
    				attr_dev(textarea, "placeholder", /*placeholder*/ ctx[3]);
    			}

    			if (dirty & /*value*/ 1) {
    				set_input_value(textarea, /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(43:2) {#if multiline}",
    		ctx
    	});

    	return block;
    }

    // (71:2) {#if value}
    function create_if_block$4(ctx) {
    	let input;
    	let input_intro;
    	let input_outro;
    	let current;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "class", "submit svelte-c4fbvv");
    			attr_dev(input, "type", "submit");
    			input.value = "Send";
    			add_location(input, file$7, 71, 4, 1806);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (input_outro) input_outro.end(1);
    				input_intro = create_in_transition(input, fade, {});
    				input_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (input_intro) input_intro.invalidate();
    			input_outro = create_out_transition(input, fade, {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			if (detaching && input_outro) input_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(71:2) {#if value}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let t;
    	let current;

    	function select_block_type(ctx, dirty) {
    		if (/*multiline*/ ctx[7]) return create_if_block_1$3;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*value*/ ctx[0] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "class", "input-with-button svelte-c4fbvv");
    			add_location(div, file$7, 41, 0, 1238);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div, t);
    				}
    			}

    			if (/*value*/ ctx[0]) {
    				if (if_block1) {
    					if (dirty & /*value*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$4(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const CHARS_PER_LINE = 40;

    function handleKeyPress(e) {
    	if (e.which === 13 && !e.shiftKey) {
    		// simulate actual submit event when user pressed return
    		// but not on 'soft return'
    		e.target.form.dispatchEvent(new Event("submit", { cancelable: true }));

    		e.preventDefault();
    	}
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let rows;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Input', slots, []);
    	let { ariaLabelledBy = null } = $$props;
    	let { ariaLabel = null } = $$props;
    	let { placeholder = null } = $$props;
    	let { value = "" } = $$props;
    	let { name = null } = $$props;
    	let { maxLength = 160 } = $$props;
    	let { maxRows = 1 } = $$props;
    	let { disabled = false } = $$props;
    	let { multiline = false } = $$props;

    	function calcRows(v) {
    		let textRows = Math.floor(v.length / CHARS_PER_LINE) + 1;
    		const numberOfReturns = (v.match(/\n/g) || []).length;
    		textRows += numberOfReturns;
    		return Math.min(maxRows, textRows);
    	}

    	const writable_props = [
    		'ariaLabelledBy',
    		'ariaLabel',
    		'placeholder',
    		'value',
    		'name',
    		'maxLength',
    		'maxRows',
    		'disabled',
    		'multiline'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Input> was created with unknown prop '${key}'`);
    	});

    	function textarea_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ('ariaLabelledBy' in $$props) $$invalidate(1, ariaLabelledBy = $$props.ariaLabelledBy);
    		if ('ariaLabel' in $$props) $$invalidate(2, ariaLabel = $$props.ariaLabel);
    		if ('placeholder' in $$props) $$invalidate(3, placeholder = $$props.placeholder);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('name' in $$props) $$invalidate(4, name = $$props.name);
    		if ('maxLength' in $$props) $$invalidate(5, maxLength = $$props.maxLength);
    		if ('maxRows' in $$props) $$invalidate(9, maxRows = $$props.maxRows);
    		if ('disabled' in $$props) $$invalidate(6, disabled = $$props.disabled);
    		if ('multiline' in $$props) $$invalidate(7, multiline = $$props.multiline);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		createEventDispatcher,
    		ariaLabelledBy,
    		ariaLabel,
    		placeholder,
    		value,
    		name,
    		maxLength,
    		maxRows,
    		disabled,
    		multiline,
    		CHARS_PER_LINE,
    		calcRows,
    		handleKeyPress,
    		rows
    	});

    	$$self.$inject_state = $$props => {
    		if ('ariaLabelledBy' in $$props) $$invalidate(1, ariaLabelledBy = $$props.ariaLabelledBy);
    		if ('ariaLabel' in $$props) $$invalidate(2, ariaLabel = $$props.ariaLabel);
    		if ('placeholder' in $$props) $$invalidate(3, placeholder = $$props.placeholder);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('name' in $$props) $$invalidate(4, name = $$props.name);
    		if ('maxLength' in $$props) $$invalidate(5, maxLength = $$props.maxLength);
    		if ('maxRows' in $$props) $$invalidate(9, maxRows = $$props.maxRows);
    		if ('disabled' in $$props) $$invalidate(6, disabled = $$props.disabled);
    		if ('multiline' in $$props) $$invalidate(7, multiline = $$props.multiline);
    		if ('rows' in $$props) $$invalidate(8, rows = $$props.rows);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 1) {
    			$$invalidate(8, rows = calcRows(value));
    		}
    	};

    	return [
    		value,
    		ariaLabelledBy,
    		ariaLabel,
    		placeholder,
    		name,
    		maxLength,
    		disabled,
    		multiline,
    		rows,
    		maxRows,
    		textarea_input_handler,
    		input_input_handler
    	];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			ariaLabelledBy: 1,
    			ariaLabel: 2,
    			placeholder: 3,
    			value: 0,
    			name: 4,
    			maxLength: 5,
    			maxRows: 9,
    			disabled: 6,
    			multiline: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get ariaLabelledBy() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabelledBy(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxLength() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxLength(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxRows() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxRows(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiline() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiline(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\MessageInput.svelte generated by Svelte v3.48.0 */
    const file$6 = "src\\MessageInput.svelte";

    function create_fragment$7(ctx) {
    	let div;
    	let form;
    	let input;
    	let updating_value;
    	let current;
    	let mounted;
    	let dispose;

    	function input_value_binding(value) {
    		/*input_value_binding*/ ctx[3](value);
    	}

    	let input_props = {
    		multiline: true,
    		disabled: !/*$user*/ ctx[1],
    		maxRows: 3,
    		name: "msg",
    		placeholder: "Message",
    		ariaLabel: "Message"
    	};

    	if (/*msgInput*/ ctx[0] !== void 0) {
    		input_props.value = /*msgInput*/ ctx[0];
    	}

    	input = new Input({ props: input_props, $$inline: true });
    	binding_callbacks.push(() => bind(input, 'value', input_value_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			form = element("form");
    			create_component(input.$$.fragment);
    			attr_dev(form, "method", "get");
    			attr_dev(form, "autocomplete", "off");
    			attr_dev(form, "class", "svelte-1djjhy7");
    			add_location(form, file$6, 11, 2, 256);
    			attr_dev(div, "class", "svelte-1djjhy7");
    			add_location(div, file$6, 10, 0, 248);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, form);
    			mount_component(input, form, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[4]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const input_changes = {};
    			if (dirty & /*$user*/ 2) input_changes.disabled = !/*$user*/ ctx[1];

    			if (!updating_value && dirty & /*msgInput*/ 1) {
    				updating_value = true;
    				input_changes.value = /*msgInput*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			input.$set(input_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $user;
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(1, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MessageInput', slots, []);
    	const dispatch = createEventDispatcher();
    	let msgInput;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MessageInput> was created with unknown prop '${key}'`);
    	});

    	function input_value_binding(value) {
    		msgInput = value;
    		$$invalidate(0, msgInput);
    	}

    	const submit_handler = e => {
    		if (!msgInput || !msgInput.trim()) return;
    		dispatch('message', msgInput);
    		$$invalidate(0, msgInput = '');
    		e.target.msg.focus();
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		user,
    		Input,
    		gun,
    		dispatch,
    		msgInput,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('msgInput' in $$props) $$invalidate(0, msgInput = $$props.msgInput);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [msgInput, $user, dispatch, input_value_binding, submit_handler];
    }

    class MessageInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MessageInput",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    function toHSL(str) {
      if (!str) return;
      const opts = {
        hue: [60, 360],
        sat: [75, 100],
        lum: [70, 71],
      };

      function range(hash, min, max) {
        const diff = max - min;
        const x = ((hash % diff) + diff) % diff;
        return x + min;
      }

      let hash = 0;
      if (str === 0) return hash;

      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
      }

      let h = range(hash, opts.hue[0], opts.hue[1]);
      let s = range(hash, opts.sat[0], opts.sat[1]);
      let l = range(hash, opts.lum[0], opts.lum[1]);

      return `hsl(${h}, ${s}%, ${l}%)`;
    }

    /* src\MessageList.svelte generated by Svelte v3.48.0 */
    const file$5 = "src\\MessageList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (51:6) {#if chat.user === $user}
    function create_if_block$3(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[4](/*chat*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "delete";
    			attr_dev(button, "class", "delete svelte-n2su4y");
    			add_location(button, file$5, 51, 8, 1283);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", prevent_default(click_handler), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(51:6) {#if chat.user === $user}",
    		ctx
    	});

    	return block;
    }

    // (32:0) {#each chats as chat (chat.msgId)}
    function create_each_block(key_1, ctx) {
    	let article;
    	let div0;
    	let span0;
    	let t0_value = new Date(parseFloat(/*chat*/ ctx[6].time)).toLocaleString('en-US', { hour12: false }) + "";
    	let t0;
    	let t1;
    	let span1;
    	let t2_value = /*chat*/ ctx[6].user + "";
    	let t2;
    	let t3;
    	let div1;
    	let t4_value = /*chat*/ ctx[6].msg + "";
    	let t4;
    	let t5;
    	let t6;
    	let article_intro;
    	let article_outro;
    	let current;
    	let if_block = /*chat*/ ctx[6].user === /*$user*/ ctx[1] && create_if_block$3(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			article = element("article");
    			div0 = element("div");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			span1 = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			div1 = element("div");
    			t4 = text(t4_value);
    			t5 = space();
    			if (if_block) if_block.c();
    			t6 = space();
    			attr_dev(span0, "class", "time");
    			add_location(span0, file$5, 38, 6, 927);
    			attr_dev(span1, "class", "user svelte-n2su4y");
    			add_location(span1, file$5, 43, 6, 1070);
    			attr_dev(div0, "class", "meta svelte-n2su4y");
    			add_location(div0, file$5, 37, 4, 902);
    			attr_dev(div1, "class", "msg svelte-n2su4y");
    			set_style(div1, "background-color", /*chat*/ ctx[6].user !== /*$user*/ ctx[1] && toHSL(/*chat*/ ctx[6].user));
    			add_location(div1, file$5, 45, 4, 1123);
    			attr_dev(article, "class", "svelte-n2su4y");
    			toggle_class(article, "user", /*chat*/ ctx[6].user === /*$user*/ ctx[1]);
    			add_location(article, file$5, 32, 2, 801);
    			this.first = article;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, div0);
    			append_dev(div0, span0);
    			append_dev(span0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, span1);
    			append_dev(span1, t2);
    			append_dev(article, t3);
    			append_dev(article, div1);
    			append_dev(div1, t4);
    			append_dev(div1, t5);
    			if (if_block) if_block.m(div1, null);
    			append_dev(article, t6);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*chats*/ 1) && t0_value !== (t0_value = new Date(parseFloat(/*chat*/ ctx[6].time)).toLocaleString('en-US', { hour12: false }) + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*chats*/ 1) && t2_value !== (t2_value = /*chat*/ ctx[6].user + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*chats*/ 1) && t4_value !== (t4_value = /*chat*/ ctx[6].msg + "")) set_data_dev(t4, t4_value);

    			if (/*chat*/ ctx[6].user === /*$user*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*chats, $user*/ 3) {
    				set_style(div1, "background-color", /*chat*/ ctx[6].user !== /*$user*/ ctx[1] && toHSL(/*chat*/ ctx[6].user));
    			}

    			if (dirty & /*chats, $user*/ 3) {
    				toggle_class(article, "user", /*chat*/ ctx[6].user === /*$user*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (article_outro) article_outro.end(1);
    				article_intro = create_in_transition(article, fade, {});
    				article_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (article_intro) article_intro.invalidate();
    			article_outro = create_out_transition(article, /*send*/ ctx[3], { key: /*chat*/ ctx[6].msgId });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			if (if_block) if_block.d();
    			if (detaching && article_outro) article_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(32:0) {#each chats as chat (chat.msgId)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*chats*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*chat*/ ctx[6].msgId;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*chats, $user, toHSL, confirm, dispatch, Date, parseFloat*/ 7) {
    				each_value = /*chats*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block, each_1_anchor, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $user;
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(1, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MessageList', slots, []);
    	const dispatch = createEventDispatcher();
    	let { chats } = $$props;

    	const [send, receive] = crossfade({
    		duration: d => Math.sqrt(d * 200),
    		fallback(node, params) {
    			const style = getComputedStyle(node);
    			const transform = style.transform === "none" ? "" : style.transform;

    			return {
    				duration: 600,
    				easing: quintOut,
    				css: t => `
          transform: ${transform} scale(${t});
          opacity: ${t}
				`
    			};
    		}
    	});

    	const writable_props = ['chats'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MessageList> was created with unknown prop '${key}'`);
    	});

    	const click_handler = chat => {
    		const yes = confirm('Are you sure?');
    		if (yes) dispatch('delete', chat.msgId);
    	};

    	$$self.$$set = $$props => {
    		if ('chats' in $$props) $$invalidate(0, chats = $$props.chats);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		fade,
    		fly,
    		user,
    		quintOut,
    		crossfade,
    		toHSL,
    		dispatch,
    		chats,
    		send,
    		receive,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('chats' in $$props) $$invalidate(0, chats = $$props.chats);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [chats, $user, dispatch, send, click_handler];
    }

    class MessageList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { chats: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MessageList",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*chats*/ ctx[0] === undefined && !('chats' in props)) {
    			console.warn("<MessageList> was created without expected prop 'chats'");
    		}
    	}

    	get chats() {
    		throw new Error("<MessageList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set chats(value) {
    		throw new Error("<MessageList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Messages.svelte generated by Svelte v3.48.0 */

    const { Object: Object_1 } = globals;
    const file$4 = "src\\Messages.svelte";

    // (100:2) {#if isLoading}
    function create_if_block_1$2(ctx) {
    	let spinner;
    	let current;
    	spinner = new Spinner({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(spinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinner, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(100:2) {#if isLoading}",
    		ctx
    	});

    	return block;
    }

    // (118:0) {#if showScrollToBottom}
    function create_if_block$2(ctx) {
    	let scrolltobottom;
    	let current;

    	scrolltobottom = new ScrollToBottom({
    			props: { onScroll: /*scrollToBottom*/ ctx[4] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(scrolltobottom.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(scrolltobottom, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scrolltobottom.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scrolltobottom.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(scrolltobottom, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(118:0) {#if showScrollToBottom}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let main_1;
    	let t0;
    	let messagelist;
    	let t1;
    	let messageinput;
    	let t2;
    	let if_block1_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*isLoading*/ ctx[3] && create_if_block_1$2(ctx);

    	messagelist = new MessageList({
    			props: { chats: /*chats*/ ctx[0] },
    			$$inline: true
    		});

    	messagelist.$on("delete", /*delete_handler*/ ctx[11]);
    	messageinput = new MessageInput({ $$inline: true });
    	messageinput.$on("message", /*message_handler*/ ctx[13]);
    	let if_block1 = /*showScrollToBottom*/ ctx[1] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			main_1 = element("main");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			create_component(messagelist.$$.fragment);
    			t1 = space();
    			create_component(messageinput.$$.fragment);
    			t2 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(main_1, "class", "svelte-i15h9r");
    			add_location(main_1, file$4, 98, 0, 2670);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main_1, anchor);
    			if (if_block0) if_block0.m(main_1, null);
    			append_dev(main_1, t0);
    			mount_component(messagelist, main_1, null);
    			/*main_1_binding*/ ctx[12](main_1);
    			insert_dev(target, t1, anchor);
    			mount_component(messageinput, target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(main_1, "scroll", /*handleScroll*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isLoading*/ ctx[3]) {
    				if (if_block0) {
    					if (dirty & /*isLoading*/ 8) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(main_1, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const messagelist_changes = {};
    			if (dirty & /*chats*/ 1) messagelist_changes.chats = /*chats*/ ctx[0];
    			messagelist.$set(messagelist_changes);

    			if (/*showScrollToBottom*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*showScrollToBottom*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(messagelist.$$.fragment, local);
    			transition_in(messageinput.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(messagelist.$$.fragment, local);
    			transition_out(messageinput.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main_1);
    			if (if_block0) if_block0.d();
    			destroy_component(messagelist);
    			/*main_1_binding*/ ctx[12](null);
    			if (detaching) detach_dev(t1);
    			destroy_component(messageinput, detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const ADD_ON_SCROLL = 50; // messages to add when scrolling to the top

    function instance$5($$self, $$props, $$invalidate) {
    	let $chatTopic;
    	let $user;
    	validate_store(chatTopic, 'chatTopic');
    	component_subscribe($$self, chatTopic, $$value => $$invalidate(15, $chatTopic = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(16, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Messages', slots, []);
    	let showMessages = 100; // initial messages to load
    	let store = {};
    	let chats = [];
    	let autoscroll;
    	let showScrollToBottom;
    	let main;
    	let isLoading = false;
    	let timeout;

    	function scrollToBottom() {
    		main.scrollTo({ left: 0, top: main.scrollHeight });
    	}

    	function handleScroll(e) {
    		$$invalidate(1, showScrollToBottom = main.scrollHeight - main.offsetHeight > main.scrollTop + 300);

    		if (!isLoading && main.scrollTop <= main.scrollHeight / 10) {
    			const totalMessages = Object.keys(store).length - 1;
    			if (showMessages >= totalMessages) return;
    			$$invalidate(3, isLoading = true);

    			setTimeout(
    				() => {
    					$$invalidate(8, showMessages += ADD_ON_SCROLL);
    					if (main.scrollTop === 0) $$invalidate(2, main.scrollTop = 1, main);
    					$$invalidate(3, isLoading = false);
    				},
    				200
    			);
    		}
    	}

    	function handleNewMessage(msg) {
    		const now = new Date().getTime();
    		const message = { msg, user: $user, time: now };
    		gun.get($chatTopic).set(message);
    	}

    	function handleDelete(msgId) {
    		gun.get($chatTopic).get(msgId).put(null);
    	}

    	onMount(async () => {
    		gun.get($chatTopic).map().on((val, msgId) => {
    			if (val) {
    				$$invalidate(9, store[msgId] = { msgId, ...val }, store);
    			} else {
    				// null messages are deleted
    				delete store[msgId];

    				// reassign store to trigger svelte's reactivity
    				$$invalidate(9, store);
    			}
    		});
    	});

    	beforeUpdate(() => {
    		autoscroll = main && main.offsetHeight + main.scrollTop > main.scrollHeight - 50;
    	});

    	afterUpdate(() => {
    		if (autoscroll) main.scrollTo(0, main.scrollHeight);
    	});

    	onDestroy(() => {
    		// remove gun listeners
    		gun.get($chatTopic).off();
    	});

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Messages> was created with unknown prop '${key}'`);
    	});

    	const delete_handler = e => {
    		handleDelete(e.detail);
    	};

    	function main_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			main = $$value;
    			$$invalidate(2, main);
    		});
    	}

    	const message_handler = e => {
    		handleNewMessage(e.detail);
    		scrollToBottom();
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		afterUpdate,
    		onMount,
    		onDestroy,
    		chatTopic,
    		user,
    		gun,
    		ScrollToBottom,
    		MessageInput,
    		MessageList,
    		ADD_ON_SCROLL,
    		showMessages,
    		store,
    		chats,
    		autoscroll,
    		showScrollToBottom,
    		main,
    		isLoading,
    		timeout,
    		scrollToBottom,
    		handleScroll,
    		handleNewMessage,
    		handleDelete,
    		$chatTopic,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('showMessages' in $$props) $$invalidate(8, showMessages = $$props.showMessages);
    		if ('store' in $$props) $$invalidate(9, store = $$props.store);
    		if ('chats' in $$props) $$invalidate(0, chats = $$props.chats);
    		if ('autoscroll' in $$props) autoscroll = $$props.autoscroll;
    		if ('showScrollToBottom' in $$props) $$invalidate(1, showScrollToBottom = $$props.showScrollToBottom);
    		if ('main' in $$props) $$invalidate(2, main = $$props.main);
    		if ('isLoading' in $$props) $$invalidate(3, isLoading = $$props.isLoading);
    		if ('timeout' in $$props) $$invalidate(10, timeout = $$props.timeout);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*timeout, store, showMessages*/ 1792) {
    			{
    				$$invalidate(3, isLoading = true);
    				if (timeout) clearTimeout(timeout);

    				// debounce update svelte store to avoid overloading ui
    				$$invalidate(10, timeout = setTimeout(
    					() => {
    						// convert key/value object to sorted array of messages (with a max length)
    						const arr = Object.values(store);

    						const sorted = arr.sort((a, b) => a.time - b.time);
    						const begin = Math.max(0, sorted.length - showMessages);
    						const end = arr.length;
    						$$invalidate(0, chats = arr.slice(begin, end));
    						$$invalidate(3, isLoading = false);
    					},
    					200
    				));
    			}
    		}
    	};

    	return [
    		chats,
    		showScrollToBottom,
    		main,
    		isLoading,
    		scrollToBottom,
    		handleScroll,
    		handleNewMessage,
    		handleDelete,
    		showMessages,
    		store,
    		timeout,
    		delete_handler,
    		main_1_binding,
    		message_handler
    	];
    }

    class Messages extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Messages",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    function flip(node, { from, to }, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
        const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
        const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
            easing,
            css: (t, u) => {
                const x = u * dx;
                const y = u * dy;
                const sx = t + u * from.width / to.width;
                const sy = t + u * from.height / to.height;
                return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
            }
        };
    }

    /* src\Settings.svelte generated by Svelte v3.48.0 */
    const file$3 = "src\\Settings.svelte";

    function create_fragment$4(ctx) {
    	let main;
    	let form;
    	let label0;
    	let t1;
    	let input0;
    	let updating_value;
    	let t2;
    	let label1;
    	let t4;
    	let input1;
    	let updating_value_1;
    	let current;
    	let mounted;
    	let dispose;

    	function input0_value_binding(value) {
    		/*input0_value_binding*/ ctx[3](value);
    	}

    	let input0_props = {
    		maxLength: "50",
    		placeholder: "Steve Jobs",
    		ariaLabelledBy: "name-label"
    	};

    	if (/*$user*/ ctx[0] !== void 0) {
    		input0_props.value = /*$user*/ ctx[0];
    	}

    	input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, 'value', input0_value_binding));

    	function input1_value_binding(value) {
    		/*input1_value_binding*/ ctx[4](value);
    	}

    	let input1_props = {
    		maxLength: "50",
    		placeholder: "Chat topic",
    		ariaLabelledBy: "chat-label"
    	};

    	if (/*$chatTopic*/ ctx[2] !== void 0) {
    		input1_props.value = /*$chatTopic*/ ctx[2];
    	}

    	input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, 'value', input1_value_binding));

    	const block = {
    		c: function create() {
    			main = element("main");
    			form = element("form");
    			label0 = element("label");
    			label0.textContent = "ENTER YOUR NICKNAME";
    			t1 = space();
    			create_component(input0.$$.fragment);
    			t2 = space();
    			label1 = element("label");
    			label1.textContent = "CHAT TOPIC";
    			t4 = space();
    			create_component(input1.$$.fragment);
    			attr_dev(label0, "id", "name-label");
    			attr_dev(label0, "class", "svelte-11z0eya");
    			add_location(label0, file$3, 14, 4, 323);
    			attr_dev(label1, "id", "chat-label");
    			attr_dev(label1, "class", "svelte-11z0eya");
    			add_location(label1, file$3, 21, 4, 507);
    			attr_dev(form, "class", "svelte-11z0eya");
    			add_location(form, file$3, 8, 2, 214);
    			attr_dev(main, "class", "svelte-11z0eya");
    			add_location(main, file$3, 7, 0, 205);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, form);
    			append_dev(form, label0);
    			append_dev(form, t1);
    			mount_component(input0, form, null);
    			append_dev(form, t2);
    			append_dev(form, label1);
    			append_dev(form, t4);
    			mount_component(input1, form, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[5]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const input0_changes = {};

    			if (!updating_value && dirty & /*$user*/ 1) {
    				updating_value = true;
    				input0_changes.value = /*$user*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};

    			if (!updating_value_1 && dirty & /*$chatTopic*/ 4) {
    				updating_value_1 = true;
    				input1_changes.value = /*$chatTopic*/ ctx[2];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(input0);
    			destroy_component(input1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $user;
    	let $nav;
    	let $chatTopic;
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(0, $user = $$value));
    	validate_store(nav, 'nav');
    	component_subscribe($$self, nav, $$value => $$invalidate(1, $nav = $$value));
    	validate_store(chatTopic, 'chatTopic');
    	component_subscribe($$self, chatTopic, $$value => $$invalidate(2, $chatTopic = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Settings', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Settings> was created with unknown prop '${key}'`);
    	});

    	function input0_value_binding(value) {
    		$user = value;
    		user.set($user);
    	}

    	function input1_value_binding(value) {
    		$chatTopic = value;
    		chatTopic.set($chatTopic);
    	}

    	const submit_handler = e => {
    		if (!$user) return;
    		set_store_value(nav, $nav = 'messages', $nav);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		fly,
    		nav,
    		user,
    		chatTopic,
    		flip,
    		Input,
    		$user,
    		$nav,
    		$chatTopic
    	});

    	return [
    		$user,
    		$nav,
    		$chatTopic,
    		input0_value_binding,
    		input1_value_binding,
    		submit_handler
    	];
    }

    class Settings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Settings",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\ui\Nav.svelte generated by Svelte v3.48.0 */
    const file$2 = "src\\ui\\Nav.svelte";

    // (9:2) {#if showBack}
    function create_if_block$1(ctx) {
    	let button;
    	let svg;
    	let path;
    	let t;
    	let mounted;
    	let dispose;
    	let if_block = /*backText*/ ctx[1] && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M13.7 15.3a1 1 0 0 1-1.4 1.4l-4-4a1 1 0 0 1 0-1.4l4-4a1 1 0 0 1 1.4\n          1.4L10.42 12l3.3 3.3z");
    			add_location(path, file$2, 16, 8, 382);
    			attr_dev(svg, "height", "40");
    			attr_dev(svg, "width", "40");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$2, 10, 6, 251);
    			attr_dev(button, "class", "svelte-gao1x3");
    			add_location(button, file$2, 9, 4, 202);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			append_dev(button, t);
    			if (if_block) if_block.m(button, null);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*backText*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					if_block.m(button, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(9:2) {#if showBack}",
    		ctx
    	});

    	return block;
    }

    // (23:6) {#if backText}
    function create_if_block_1$1(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*backText*/ ctx[1]);
    			attr_dev(span, "class", "svelte-gao1x3");
    			add_location(span, file$2, 23, 8, 585);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*backText*/ 2) set_data_dev(t, /*backText*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(23:6) {#if backText}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let nav;
    	let t;
    	let h1;
    	let current;
    	let if_block = /*showBack*/ ctx[0] && create_if_block$1(ctx);
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			if (if_block) if_block.c();
    			t = space();
    			h1 = element("h1");
    			if (default_slot) default_slot.c();
    			attr_dev(h1, "class", "svelte-gao1x3");
    			add_location(h1, file$2, 27, 2, 645);
    			attr_dev(nav, "class", "svelte-gao1x3");
    			add_location(nav, file$2, 7, 0, 175);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			if (if_block) if_block.m(nav, null);
    			append_dev(nav, t);
    			append_dev(nav, h1);

    			if (default_slot) {
    				default_slot.m(h1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*showBack*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(nav, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Nav', slots, ['default']);
    	let { showBack = false } = $$props;
    	let { backText = null } = $$props;
    	const dispatch = createEventDispatcher();
    	const writable_props = ['showBack', 'backText'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Nav> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatch('back');

    	$$self.$$set = $$props => {
    		if ('showBack' in $$props) $$invalidate(0, showBack = $$props.showBack);
    		if ('backText' in $$props) $$invalidate(1, backText = $$props.backText);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		showBack,
    		backText,
    		dispatch
    	});

    	$$self.$inject_state = $$props => {
    		if ('showBack' in $$props) $$invalidate(0, showBack = $$props.showBack);
    		if ('backText' in $$props) $$invalidate(1, backText = $$props.backText);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [showBack, backText, dispatch, $$scope, slots, click_handler];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { showBack: 0, backText: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get showBack() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showBack(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backText() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backText(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* Page.svelte generated by Svelte v3.48.0 */
    const file$1 = "Page.svelte";

    function create_fragment$2(ctx) {
    	let div1;
    	let div0;
    	let div1_intro;
    	let div1_outro;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "container svelte-lj276o");
    			add_location(div0, file$1, 5, 2, 107);
    			attr_dev(div1, "class", "animation svelte-lj276o");
    			add_location(div1, file$1, 4, 0, 64);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (div1_outro) div1_outro.end(1);
    				div1_intro = create_in_transition(div1, fade, {});
    				div1_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (div1_intro) div1_intro.invalidate();
    			div1_outro = create_out_transition(div1, fade, {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div1_outro) div1_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Page', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Page> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ fade });
    	return [$$scope, slots];
    }

    class Page extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Page",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\Footer.svelte generated by Svelte v3.48.0 */

    const file = "src\\Footer.svelte";

    function create_fragment$1(ctx) {
    	let footer;
    	let t0;
    	let span;
    	let t2;
    	let a0;
    	let t4;
    	let br0;
    	let t5;
    	let a1;
    	let t7;
    	let a2;
    	let t9;
    	let a3;
    	let t11;
    	let br1;
    	let t12;
    	let t13_value = process.env.APP_VERSION + "";
    	let t13;
    	let t14;
    	let t15_value = process.env.COMMIT_HASH + "";
    	let t15;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			t0 = text("Made with\n  ");
    			span = element("span");
    			span.textContent = "♥️";
    			t2 = text("\n  by\n  ");
    			a0 = element("a");
    			a0.textContent = "Koen van Gilst";
    			t4 = space();
    			br0 = element("br");
    			t5 = text("\n  Using\n  ");
    			a1 = element("a");
    			a1.textContent = "svelte";
    			t7 = text("\n  and\n  ");
    			a2 = element("a");
    			a2.textContent = "gunDB";
    			t9 = text("\n  see\n  ");
    			a3 = element("a");
    			a3.textContent = "Github";
    			t11 = space();
    			br1 = element("br");
    			t12 = text("\n  v. ");
    			t13 = text(t13_value);
    			t14 = text(" git ");
    			t15 = text(t15_value);
    			attr_dev(span, "class", "svelte-17ail42");
    			add_location(span, file, 2, 2, 23);
    			attr_dev(a0, "href", "https://koenvangilst.nl");
    			add_location(a0, file, 4, 2, 46);
    			add_location(br0, file, 5, 2, 101);
    			attr_dev(a1, "href", "https://svelte.dev/");
    			add_location(a1, file, 7, 2, 118);
    			attr_dev(a2, "href", "https://gun.eco/");
    			add_location(a2, file, 9, 2, 167);
    			attr_dev(a3, "href", "https://github.com/vnglst/svelte-gundb-chat");
    			add_location(a3, file, 11, 2, 212);
    			add_location(br1, file, 12, 2, 279);
    			attr_dev(footer, "class", "svelte-17ail42");
    			add_location(footer, file, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, t0);
    			append_dev(footer, span);
    			append_dev(footer, t2);
    			append_dev(footer, a0);
    			append_dev(footer, t4);
    			append_dev(footer, br0);
    			append_dev(footer, t5);
    			append_dev(footer, a1);
    			append_dev(footer, t7);
    			append_dev(footer, a2);
    			append_dev(footer, t9);
    			append_dev(footer, a3);
    			append_dev(footer, t11);
    			append_dev(footer, br1);
    			append_dev(footer, t12);
    			append_dev(footer, t13);
    			append_dev(footer, t14);
    			append_dev(footer, t15);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.48.0 */

    // (16:30) 
    function create_if_block_1(ctx) {
    	let page;
    	let current;

    	page = new Page({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(page.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(page, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const page_changes = {};

    			if (dirty & /*$$scope, $nav*/ 5) {
    				page_changes.$$scope = { dirty, ctx };
    			}

    			page.$set(page_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(page.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(page.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(page, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(16:30) ",
    		ctx
    	});

    	return block;
    }

    // (10:0) {#if $nav === 'settings'}
    function create_if_block(ctx) {
    	let page;
    	let current;

    	page = new Page({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(page.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(page, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const page_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				page_changes.$$scope = { dirty, ctx };
    			}

    			page.$set(page_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(page.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(page.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(page, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(10:0) {#if $nav === 'settings'}",
    		ctx
    	});

    	return block;
    }

    // (18:4) <Nav       showBack       backText="Sign In"       on:back={() => {         $nav = 'settings';       }}     >
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Messages");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(18:4) <Nav       showBack       backText=\\\"Sign In\\\"       on:back={() => {         $nav = 'settings';       }}     >",
    		ctx
    	});

    	return block;
    }

    // (17:2) <Page>
    function create_default_slot_2(ctx) {
    	let nav_1;
    	let t;
    	let messages;
    	let current;

    	nav_1 = new Nav({
    			props: {
    				showBack: true,
    				backText: "Sign In",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	nav_1.$on("back", /*back_handler*/ ctx[1]);
    	messages = new Messages({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(nav_1.$$.fragment);
    			t = space();
    			create_component(messages.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(nav_1, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(messages, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const nav_1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				nav_1_changes.$$scope = { dirty, ctx };
    			}

    			nav_1.$set(nav_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav_1.$$.fragment, local);
    			transition_in(messages.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav_1.$$.fragment, local);
    			transition_out(messages.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(nav_1, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(messages, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(17:2) <Page>",
    		ctx
    	});

    	return block;
    }

    // (12:2) <Nav>
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Sign In");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(12:2) <Nav>",
    		ctx
    	});

    	return block;
    }

    // (11:0) <Page>
    function create_default_slot(ctx) {
    	let nav_1;
    	let t0;
    	let settings;
    	let t1;
    	let footer;
    	let current;

    	nav_1 = new Nav({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	settings = new Settings({ $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(nav_1.$$.fragment);
    			t0 = space();
    			create_component(settings.$$.fragment);
    			t1 = space();
    			create_component(footer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(nav_1, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(settings, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const nav_1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				nav_1_changes.$$scope = { dirty, ctx };
    			}

    			nav_1.$set(nav_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav_1.$$.fragment, local);
    			transition_in(settings.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav_1.$$.fragment, local);
    			transition_out(settings.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(nav_1, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(settings, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(11:0) <Page>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_if_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$nav*/ ctx[0] === 'settings') return 0;
    		if (/*$nav*/ ctx[0] === 'messages') return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $nav;
    	validate_store(nav, 'nav');
    	component_subscribe($$self, nav, $$value => $$invalidate(0, $nav = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const back_handler = () => {
    		set_store_value(nav, $nav = 'settings', $nav);
    	};

    	$$self.$capture_state = () => ({
    		nav,
    		Messages,
    		Settings,
    		Nav,
    		Page,
    		Footer,
    		$nav
    	});

    	return [$nav, back_handler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    document.body.innerHTML = "";

    const app = new App({
      target: document.body,
    });

    const production = process.env.NODE_ENV === "production";
    // Check that service workers are supported
    // only load in production
    if ("serviceWorker" in navigator) {
      // Use the window load event to keep the page load performant
      window.addEventListener("load", () => {
        // only load in production
        if (production) navigator.serviceWorker.register("serviceworker.js");

        // remove all old service workers when developing
        if (!production) {
          navigator.serviceWorker.getRegistrations().then((registrations) => {
            console.log("Unloading service workers", registrations);
            for (let registration of registrations) {
              registration.unregister();
            }
          });
        }
      });
    }

    return app;

})();
//# sourceMappingURL=bundle.js.map
