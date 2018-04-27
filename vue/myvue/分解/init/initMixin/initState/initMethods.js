    function initMethods(vm, methods) {
        var props = vm.$options.props;
        for (var key in methods) {
            vm[key] = methods[key] == null ? noop : bind(methods[key], vm); {
                if (methods[key] == null) {
                    warn(
                        "method \"" + key + "\" has an undefined value in the component definition. " +
                        "Did you reference the function correctly?",
                        vm
                    );
                }
                if (props && hasOwn(props, key)) {
                    warn(
                        ("method \"" + key + "\" has already been defined as a prop."),
                        vm
                    );
                }
            }
        }
    }