cabal.js
========
Javascript library designed to render SharePoint odata search results. Uses React components. IE9 or later required.

Usage
=====
// TODO

mapper
======
cabal.mapper object contains two functions. The property function creates a new CabalProperty that can be passed to the cabal.Properties function as well as used to get a value for propertie's attribute. The extend function in mapper can be used to add functions to CabalProperty should it be necessary. All rendered properties must have a component type specified. Default component is Text which is actually a span element.

The component type is set by calling the as method of CabalProperty. as accepts the component's name as parameter, not the component object. The react method also sets the component type. The react method accepts the tag name that should be rendered.

components
==========
Cabal ships with several components. Table, and List are composed of smaller components and render an HTML table or list respectively. New components should be added by calling the extend method of cabal.components. The method accepts the name of the new component and the render function. The render function must return a React component. Inside the render function this.props contains whatever was passed to the function on render time. this.props.inputs object contains things assembled by cabal. extend also prevents overwriting existing components.

cabal.Headers
=============
Accepts a collection of header titles, a component type name, and optionally a function that is called with each column title. The return value becomes the text content of the rendered component.

Lifecycle
=========
#Init
Calling the cabal function begins the lifecycle of a cabal process. This is called the init phase. The init phase transforms a collection of cabal compatible properties to a row template, and a list of properties that will eventually be rendered. Cabal compatible properties can be plain old javascript objects. Their only requirements are name, and componentType fields. Both fields must have a string value. Alternatively the mapper function is cabal utitilies can be used the create the properties.
##Row template
The row template is actually a collection of functions that each represent a column of data. The function is called at a later stage when the actual data is available.

#Pre render
Calling the function that was returned after the init phase starts rendering the results that were passed as argument. However, before the rendering can actually take place the pre render phase will create a collection of renderable items. After preRender function has returned the rendering function is called automatically.

#Render
The render function receives two arguments: the data from pre render phase as well as the headers from the init phase. It is up to the rendered to decide what to do with the data, and headers. The renderer must also know where it will render the results.
