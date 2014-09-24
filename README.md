cabal.js
========
Javascript library designed to render SharePoint odata search results. Requires a separate rendering plugin. Works on IE9 or later.

##Usage
Cabal is instantiated by calling the `cabal` function in global namespace. This function takes two arguments. The first is a collection of cabal compatible properties. The second is a collection of header titles i.e. an array of strings. Cabal compatible properties can be plain old javascript objects. Their only requirements are **name**, and **componentType** fields. Both fields must have a string value. Any attributes such as href for links must be in an attribute map that is set as the value of **attr** field. Values in the attribute map can be cabal compatible properties. Nested attribute maps won't work.

The `mapper` function in `cabalutils` can be used the create the properties. `cabalutils` comes with the cabal-with-utils.js version of cabal.

The `cabal` function returns another function that will start the rendering process. This function takes the actual rendering function, and the actual search results as arguments. Explaining the structure of the search results object is out of this readme's scope. Cabal expects a collection where the entries have a **Cells** field.

##Rendering function
The user must supply cabal with a rendering function. When the function is called two parameters are passed to it. The first is a collection of data. Each entry is also a collection that represents a row in the results. The entries or columns are objects that have fields **type** and **inputs**. The type field holds the component type that was specified in the cabal compatible property. The inputs field holds everything else.

The **children** field in the inputs object has the value from search results unless the children field was included in the initial property. The inputs object also holds all values from the attribute map. If a property was set as the value for an attribute the inputs object has the actual value from the results.

```
// example row
[{ type: "span", inputs: { children: "one search results" } },
 { type: "a", inputs: { children: "source", href: "http://source" } }]
```

##Lifecycle
###Init
Calling the cabal function begins the lifecycle of a cabal process. This is called the init stage. The init stage transforms a collection of cabal compatible properties to a row template, and a list of properties that will eventually be rendered. 
####Row template
The row template is actually a collection of functions that each represent a column of data. The function is called at a later stage when the actual data is available.

###Pre render
Calling the function that was returned after the init stage starts rendering the results that were passed as argument. However, before the rendering can actually take place the pre render stage will create a collection of renderable items. After preRender function has returned the rendering function is called automatically.

###Render
The render function receives two arguments: the data from pre render stage as well as the headers from the init stage. It is up to the rendered to decide what to do with the data, and headers. The renderer must also know where it will render the results in the DOM.

##cabalutils
###mapper
cabalutils.mapper function takes a property name and returns a cabal compatible property with a component type _span_. These objects have two methods. `as` is used to set the component type. `attributes` accepts an object that is set as value for the attr field of the property object. Both of these methods return the object itself so calls can be chained.
