var cabalmap = (function () {
    var mapper = cabalutils.mapper;
    var comp = reactComponentRepository;

    comp('StatusText', function () {
        var value = this.props.children; 
        if (value === 'In Progress') this.props.className = 'green';
        else if (value === 'Onhold') this.props.className = 'orange';
        else this.props.className = 'red';
        return (React.DOM.span(this.props));
    });

    var headers = [
        'Project',
        'Due Date',
        'Status',
        'Customer'
    ];

    var pm = [
        mapper('Title').as('Link').attributes({ href: mapper('SiteName') }),
        mapper('DateOfAction').as('DateTime'),
        mapper('ProjectStatus').as('StatusText'),
        mapper('Customer'),
    ];

    return { headers: headers, properties: pm };
})();

var caballist = (function () {
    var mapper = cabalutils.mapper;

    var labels = [
        'Name: ',
        'Title: ',
        'Avatar: '
    ];

    var propertymappings = [
        mapper('DisplayName'),
        mapper('Title'),
        mapper('PictureURL').as('Image')
    ];

    return { headers: labels, properties: propertymappings };
})();

var results = [
    { Cells: { results:
        [{ Key: 'Title', Value: 'Provision of Customer Relationship Management System', Type: 'Edm.String' },
         { Key: 'Customer', Value: 'Carmen May', Type: 'Edm.String' },
         { Key: 'DateOfAction', Value: (new Date(2014, 6, 24)).toISOString(), Type: 'Edm.DateTime' },
         { Key: 'SiteName', Value: 'http://www.google.com', Type: 'Edm.String' },
         { Key: 'ProjectStatus', Value: 'In Progress', Type: 'Edm.String' }]
    }},

    { Cells: { results:
        [{ Key: 'Title', Value: 'Framework for Executive Search and Recruitment', Type: 'Edm.String' },
         { Key: 'Customer', Value: 'Joshua Harris', Type: 'Edm.String' },
         { Key: 'DateOfAction', Value: (new Date(2014, 7, 7)).toISOString(), Type: 'Edm.DateTime' },
         { Key: 'SiteName', Value: 'http://virta.baz', Type: 'Edm.String' },
         { Key: 'ProjectStatus', Value: 'Onhold', Type: 'Edm.String' }],
    }},

    { Cells: { results:
        [{ Key: 'Title', Value: 'Innovative Ship to Shore Ferry Charging Solution', Type: 'Edm.String' },
         { Key: 'Customer', Value: 'Mario Castro', Type: 'Edm.String' },
         { Key: 'DateOfAction', Value: (new Date(2014, 9, 28)).toISOString(), Type: 'Edm.DateTime' },
         { Key: 'SiteName', Value: 'http://virta.baz', Type: 'Edm.String' },
         { Key: 'ProjectStatus', Value: 'In Progress', Type: 'Edm.String' }],
    }},

    { Cells: { results:
        [{ Key: 'Title', Value: 'Installation of Energy Efficiency Measures', Type: 'Edm.String' },
         { Key: 'Customer', Value: 'Lonnie Hunt', Type: 'Edm.String' },
         { Key: 'DateOfAction', Value: (new Date(2014, 8, 11)).toISOString(), Type: 'Edm.DateTime' },
         { Key: 'SiteName', Value: 'http://virta.baz', Type: 'Edm.String' },
         { Key: 'ProjectStatus', Value: 'In Progress', Type: 'Edm.String' }],
    }},

    { Cells: { results:
        [{ Key: 'Title', Value: 'Replacement Pipework', Type: 'Edm.String' },
         { Key: 'Customer', Value: 'Emma Howard', Type: 'Edm.String' },
         { Key: 'DateOfAction', Value: (new Date(2014, 7, 11)).toISOString(), Type: 'Edm.DateTime' },
         { Key: 'SiteName', Value: 'http://virta.baz', Type: 'Edm.String' },
         { Key: 'ProjectStatus', Value: 'Onhold', Type: 'Edm.String' }],
    }},

    { Cells: { results:
        [{ Key: 'Title', Value: 'Broadcasting Equipment and Associated Infrastructure', Type: 'Edm.String' },
         { Key: 'Customer', Value: 'George Hudson', Type: 'Edm.String' },
         { Key: 'DateOfAction', Value: (new Date(2014, 6, 22)).toISOString(), Type: 'Edm.DateTime' },
         { Key: 'SiteName', Value: 'http://mcninja.com', Type: 'Edm.String' },
         { Key: 'ProjectStatus', Value: 'Late', Type: 'Edm.String' }]
    }},
];

var people = [
    { Cells: { results:
        [{ Key: 'DisplayName', Value: 'Lydia Fernandez' },
         { Key: 'PictureURL', Value: 'http://api.randomuser.me/portraits/women/94.jpg' },
         { Key: 'Title', Value: 'User Experience Manager' },
         { Key: 'Email', Value: 'lydia.fernandez12@example.com' },
         { Key: 'Mobile', Value: '(317)-468-8105' }],
    }},

    { Cells: { results:
        [{ Key: 'DisplayName', Value: 'Jeff Bailey' },
         { Key: 'PictureURL', Value: 'http://api.randomuser.me/portraits/men/80.jpg' },
         { Key: 'Title', Value: 'Content Ninja' },
         { Key: 'Email', Value: 'jeff.bailey91@example.com' },
         { Key: 'Mobile', Value: '(169)-716-6932' }],
    }},

    { Cells: { results:
        [{ Key: 'DisplayName', Value: 'Donald Gardner' },
         { Key: 'PictureURL', Value: 'http://api.randomuser.me/portraits/men/15.jpg' },
         { Key: 'Title', Value: 'Brand Manager' },
         { Key: 'Email', Value: 'donald.gardner59@example.com' },
         { Key: 'Mobile', Value: '(925)-983-8035' }],
    }},

    { Cells: { results:
        [{ Key: 'DisplayName', Value: 'Joan Alexander' },
         { Key: 'PictureURL', Value: 'http://api.randomuser.me/portraits/women/34.jpg' },
         { Key: 'Title', Value: 'Lead Developer' },
         { Key: 'Email', Value: 'joan.alexander27@example.com' },
         { Key: 'Mobile', Value: '(698)-213-7104' }],
    }},

    { Cells: { results:
        [{ Key: 'DisplayName', Value: 'Laurie Allen' },
         { Key: 'PictureURL', Value: 'http://api.randomuser.me/portraits/women/45.jpg' },
         { Key: 'Title', Value: 'Systems Engineer' },
         { Key: 'Email', Value: 'laurie.allen93@example.com' },
         { Key: 'Mobile', Value: '(924)-587-2336' }],
    }},

    { Cells: { results:
        [{ Key: 'DisplayName', Value: 'Salvador Stevens' },
         { Key: 'PictureURL', Value: 'http://api.randomuser.me/portraits/men/84.jpg' },
         { Key: 'Title', Value: 'Infrastructure Specialist' },
         { Key: 'Email', Value: 'salvador.stevens22@example.com' },
         { Key: 'Mobile', Value: '(118)-454-1902' }]
    }},
];

(function () {
    var tableRenderer = cabalReactRenderer(reactComponentRepository('Table'), document.getElementById('tableGoesHere'));
    cabal(cabalmap.properties, cabalmap.headers)(tableRenderer, results);

    var listRenderer = cabalReactRenderer(reactComponentRepository('List'), document.getElementById('peopleGoesHere'));
    cabal(caballist.properties, caballist.headers)(listRenderer, people);
})();
