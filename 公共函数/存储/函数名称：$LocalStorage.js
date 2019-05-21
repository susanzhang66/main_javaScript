函数名称：$LocalStorage
函数描述： getUserData作用域是当前文档同目录的文档中，localStorage是整个文档源。文档源通过协议，主机名，和端口确定。
LocalStorage，兼容ie   永久性的
函数代码： 
$LocalStorage = ( function () {

        var storage = window.localStorage || getUserData() || null,
            LOCAL_FILE = "localStorage";

        return {

            save: function ( key, data ) {

                if ( storage && data) {
                    storage.setItem( key, data  );
                    return true;
                }

                return false;

            },

            get: function ( key ) {

                if ( storage ) {
                    return storage.getItem( key );
                }

                return null;

            },

            remove: function ( key ) {

                storage && storage.removeItem( key );

            }

        };

        function getUserData () {

            var container = document.createElement( "div" );
            container.style.display = "none";

            if( !container.addBehavior ) {
                return null;
            }

            container.addBehavior("#default#userdata");    // container.style.behavior = "url('#default#userData')"   ???

            return {

                getItem: function ( key ) {

                    var result = null;

                    try {
                        document.body.appendChild( container );
                        container.load( LOCAL_FILE );
                        result = container.getAttribute( key );
                        document.body.removeChild( container );
                    } catch ( e ) {
                    }

                    return result;

                },

                setItem: function ( key, value ) {

                    document.body.appendChild( container );
                    container.setAttribute( key, value );
                    container.save( LOCAL_FILE );
                    document.body.removeChild( container );

                },
//               暂时没有用到
//                clear: function () {
//
//                    var expiresTime = new Date();
//                    expiresTime.setFullYear( expiresTime.getFullYear() - 1 );
//                    document.body.appendChild( container );
//                    container.expires = expiresTime.toUTCString();
//                    container.save( LOCAL_FILE );
//                    document.body.removeChild( container );
//
//                },

                removeItem: function ( key ) {

                    document.body.appendChild( container );
                    container.removeAttribute( key );
                    container.save( LOCAL_FILE );
                    document.body.removeChild( container );

                }

            };

        }

    } )();
调用示例： 
$LocalStorage.save( 'a', 'aa' );

$LocalStorage.get( 'a' );

$LocalStorage.remove( 'a' );