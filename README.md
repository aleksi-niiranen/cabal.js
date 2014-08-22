cabal.js
========

Javascript library designed to render SharePoint odata search results. Uses React components. IE9 or later required.

Usage
=====

cabal(columnMappings, component)(result, parent)

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

