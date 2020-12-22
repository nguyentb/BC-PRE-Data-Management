import MCLHandler from 'mcl-wasm';
import MCL_C from 'mcl-wasm/mcl_c.wasm';
import MCL_C512 from 'mcl-wasm/mcl_c512.wasm';

const nativeFetch = window.fetch;
window.fetch = (...args) => {
    if (args[0] === '/mcl_c.wasm')
        return new Promise(resolve => resolve(new Response(MCL_C)));
    if (args[0] === '/mcl_c512.wasm')
        return new Promise(resolve => resolve(new Response(MCL_C512)));
    return nativeFetch(...args);
}

export default MCLHandler;