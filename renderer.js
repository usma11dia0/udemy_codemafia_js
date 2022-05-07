function createVNode(type='', props = {}, children ='') {
    return{
        type,
        props,
        children
    }
}

function patch(n1, n2, container) {
    console.log(n1, n2);
}

export { createVNode, patch};