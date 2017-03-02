/**
 * Fluent DOM Manipulation
 *
 * @author  Tommy Montgomery <http://tommymontgomery.com/>
 * @customizedBy Luca Campanale
 * @license http://sam.zoy.org/wtfpl/
 */

var FluentDom = (function(){
    var FluentDom = function(node) {
        return new FluentDomInternal(node);
    }
    
    FluentDom.create = function(tagName, num) {
        var f = new FluentDomInternal();
        f.create(tagName, num || null);
        return f;
    }
    
    var FluentDomInternal = function(node) {
        var root = node || null;
        
        this.fluentDom = "1.0";
        
        this.append = function(obj) {

            if(root && Array.isArray(root)){
                var rootLength = root.length;
                root = root[0];
                this.append(obj);
                var tempRoot = root;
                root = [];
                for(let i = 0; i < rootLength; i++){
                    root.push(tempRoot.cloneNode(true));
                }
                return this;
            }

            if (!root || !root.appendChild) {
                throw new Error("Cannot append to a non-element");
            }
            
            var type = typeof(obj);
            if (type === "object") {
                if(Array.isArray(obj)){
                    obj.forEach( element => {
                        this.append(element);
                    });
                    return this;
                } 
                if (obj.fluentDom) {
                    if(Array.isArray(obj.toDom())){
                        obj.toDom().forEach( function(element, index) {
                            root.appendChild(element);
                        });
                    } else {
                        root.appendChild(obj.toDom());
                    }                    
                } else if (obj.nodeType) {
                    root.appendChild(obj);
                } else {
                    throw new Error("Invalid argument: not a DOM element or a FluentDom object");
                }
                
            } else if (type === "string" || type === "number") {
                root.appendChild(document.createTextNode(obj));
            } else {
                throw new Error("Invalid argument: not an object (you gave me a " + typeof(obj) + ")");
            }
            
            return this;
        }
        
        this.attr = function(name, value) {
            if (!root || !root.setAttribute) {
                throw new Error("Cannot set an attribute on a non-element");
            }
            
            root.setAttribute(name, value);
            return this;
        }
        
        this.text = function(text) {
            return this.append(text);
        }
        
        this.create = function(tagName, num) {
            if(num){
                for(let i = 0; i < num; i++){
                    this.create(tagName);
                }
            }else{
                var newTag = document.createElement(tagName);
                if(!root){
                    root = newTag;
                } else if(!Array.isArray(root)){
                    root = [root, newTag];
                } else {
                    root.push(newTag)
                }
            }
            return this;
        }
        
        this.id = function(value) {
            return this.attr("id", value);
        }
        
        this.title = function(value) {
            return this.attr("title", value);
        }
        
        this.cls = function(value) {
            return this.attr("class", value);
        }
        
        this.clear = function() {
            root = null;
            return this;
        }
        
        this.toDom = function() {
            return root;
        }
        
        this.href = function(link) {
            return this.attr("href", link);
        }

        this.on = function(event, cb) {
            root.addEventListener(event, cb);
            return this;
        }
        
    };
    
    return FluentDom;

})();

module.exports = FluentDom;