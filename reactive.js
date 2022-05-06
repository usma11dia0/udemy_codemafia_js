const handler = {
    get(target, key, value, receiver){
        const res = Reflect.get(target, key, value, receiver);
        console.log('%c[reactive:get]', 'background: green; color: white;', target, key, res)
        track(target, key);
        return res;
    },
    set(target, key, value, receiver){
        const res = Reflect.set(target, key, value, receiver);
        console.log('%c[reactive:get]', 'background: red; color: white;', target, key, value)
        trigger(target,key);
        return res;
    }
}

function reactive(target){
    return new Proxy(target, handler);
}


let activeEffect = null
function effect(fn) {
    activeEffect = fn;
    activeEffect();
    activeEffect = null;
}

const targetMap = new WeakMap();
function track(target, key) {
    if(activeEffect === null){
        return;
    }
    let depsMap = targetMap.get(target); 
    
    if(!depsMap){
        targetMap.set(target, (depsMap = new Map())); //文字列(プロパティ名)とコールバック関数の依存関係を保持。 weakmapはオブジェクトのみなので使えない。
    }

    let deps = depsMap.get(key);
    if(!deps) {
        depsMap.set(key, deps = new Set()); //プロパティ名とコールバック関数の関係を保持
    }
    if(!deps.has(activeEffect)){
        console.log('%c[effect:register]', 'background: blue; color: white;', target, key, activeEffect);
        deps.add(activeEffect);
    }
}

function trigger(target, key) {
    const depsMap = targetMap.get(target);
    if(!depsMap){
        return;
    }
    const deps = depsMap.get(key);
    if(!deps){
        return;
    }
    deps.forEach(effect => effect());
}
export { effect, trigger, reactive };