/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Project = function ( editor ) {

	var config = editor.config;
	var signals = editor.signals;

	var rendererTypes = {

		'WebGLRenderer': THREE.WebGLRenderer,
		'CanvasRenderer': THREE.CanvasRenderer,
		'SVGRenderer': THREE.SVGRenderer,
		'SoftwareRenderer': THREE.SoftwareRenderer,
		'RaytracingRenderer': THREE.RaytracingRenderer

	};

	var container = new UI.Panel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );

	// Furniture category
	var categories = ["images/icon-info.png","images/icon-info.png","images/icon-info.png"];
	var styles = [
		["images/rishi_1.jpg","images/rishi_2.jpg","images/rishi_3.jpg","images/rishi_4.jpg","images/rishi_5.jpg"],
		["images/meishi_1.jpg","images/meishi_2.jpg","images/meishi_3.jpg","images/meishi_4.jpg","images/meishi_5.jpg"],
		["images/dizhonghai_1.jpg","images/dizhonghai_2.jpg","images/dizhonghai_3.jpg","images/dizhonghai_4.jpg","images/dizhonghai_5.jpg"]
	];
	var categoryLabels = [
		"日式","美式","地中海"
	];

	var opsRow = new UI.Row();
	var addBtn = new UI.Button("Add").onClick(function(){
			addModelSelf();
	});
	opsRow.add(addBtn);
	container.add(opsRow);

	function addModel() {
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		var file = fso.GetFile("models/chaji.DAE");

		editor.loader.loadFile(file);
	}

	function addModelSelf() {
		// instantiate a loader
		editor.loader = new THREE.ColladaLoader();

		editor.loader.load(
			// resource URL
			'http://7xrmb9.com1.z0.glb.clouddn.com/15x.DAE',
			// Function when resource is loaded
			function ( collada ) {
				//scene.add( collada.scene );
				editor.execute( new AddObjectCommand( collada.scene ) );
			},
			// Function called when download progresses
			function ( xhr ) {
				console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
			}
		);


		editor.loader = new THREE.TextureLoader();

		// load a resource
		editor.loader.load(
			// resource URL
			'http://7xrmb9.com1.z0.glb.clouddn.com/1.jpg',
			// Function when resource is loaded
			function ( texture ) {
				// do something with the texture
				var material = new THREE.MeshBasicMaterial( {
					map: texture
				 } );
			},
			// Function called when download progresses
			function ( xhr ) {
				console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
			},
			// Function called when download errors
			function ( xhr ) {
				console.log( 'An error happened' );
			}
		);

	}


	var categoryRow = new UI.Row();
	for ( var category in categoryLabels ) {
		var categoryBtn = new UI.Button(categoryLabels[category]).onClick(function(){
			selectCategory(this.getValue());
		});

		categoryRow.add(categoryBtn);

	}
	container.add(categoryRow);

	var stylesRow = new UI.Row();
	function selectCategory(category){
		var stylesDiv = new UI.Div();
		stylesDiv.id = "stylesDiv";
		if (category == '日式') {
			for (var style in styles[0]) {
				var link = document.createElement( 'a' );
				link.href = "javascript:selectStyle()";
				var img = document.createElement('img');
				img.width = 75;
				img.height = 75;
				img.src = styles[0][style];
				link.appendChild(img);
				stylesDiv.dom.appendChild(link);
			}
			stylesRow.add(stylesDiv);
		} else if (category == '美式') {
			for (var style in styles[0]) {
				var link = document.createElement( 'a' );
				link.href = "javascript:selectStyle()";
				var img = document.createElement('img');
				img.width = 75;
				img.height = 75;
				img.src = styles[1][style];
				link.appendChild(img);
				stylesDiv.dom.appendChild(link);
			}
			stylesRow.add(stylesDiv);
		} else if (category == '地中海') {
			for (var style in styles[0]) {
				var link = document.createElement( 'a' );
				link.href = "javascript:selectStyle()";
				var img = document.createElement('img');
				img.width = 75;
				img.height = 75;
				img.src = styles[2][style];
				link.appendChild(img);
				stylesDiv.dom.appendChild(link);
			}
			stylesRow.add(stylesDiv);
		}
	}
	container.add(stylesRow);

	function selectStyle() {
		alert(111);
	}

	// class

	var options = {};

	for ( var key in rendererTypes ) {

		if ( key.indexOf( 'WebGL' ) >= 0 && System.support.webgl === false ) continue;

		options[ key ] = key;

	}

	var rendererTypeRow = new UI.Row();
	var rendererType = new UI.Select().setOptions( options ).setWidth( '150px' ).onChange( function () {

		var value = this.getValue();

		config.setKey( 'project/renderer', value );

		updateRenderer();

	} );

	rendererTypeRow.add( new UI.Text( 'Renderer' ).setWidth( '90px' ) );
	rendererTypeRow.add( rendererType );

	//container.add( rendererTypeRow );

	if ( config.getKey( 'project/renderer' ) !== undefined ) {

		rendererType.setValue( config.getKey( 'project/renderer' ) );

	}

	// antialiasing

	var rendererPropertiesRow = new UI.Row();
	rendererPropertiesRow.add( new UI.Text( '' ).setWidth( '90px' ) );

	var rendererAntialias = new UI.THREE.Boolean( config.getKey( 'project/renderer/antialias' ), 'antialias' ).onChange( function () {

		config.setKey( 'project/renderer/antialias', this.getValue() );
		updateRenderer();

	} );
	rendererPropertiesRow.add( rendererAntialias );

	// shadow

	var rendererShadows = new UI.THREE.Boolean( config.getKey( 'project/renderer/shadows' ), 'shadows' ).onChange( function () {

		config.setKey( 'project/renderer/shadows', this.getValue() );
		updateRenderer();

	} );
	rendererPropertiesRow.add( rendererShadows );

	//container.add( rendererPropertiesRow );

	// Editable

	var editableRow = new UI.Row();
	var editable = new UI.Checkbox( config.getKey( 'project/editable' ) ).setLeft( '100px' ).onChange( function () {

		config.setKey( 'project/editable', this.getValue() );

	} );

	editableRow.add( new UI.Text( 'Editable' ).setWidth( '90px' ) );
	editableRow.add( editable );

	//container.add( editableRow );

	// VR

	var vrRow = new UI.Row();
	var vr = new UI.Checkbox( config.getKey( 'project/vr' ) ).setLeft( '100px' ).onChange( function () {

		config.setKey( 'project/vr', this.getValue() );
		// updateRenderer();

	} );

	vrRow.add( new UI.Text( 'VR' ).setWidth( '90px' ) );
	vrRow.add( vr );

	//container.add( vrRow );

	//

	function updateRenderer() {

		createRenderer( rendererType.getValue(), rendererAntialias.getValue(), rendererShadows.getValue() );

	}

	function createRenderer( type, antialias, shadows ) {

		if ( type === 'WebGLRenderer' && System.support.webgl === false ) {

			type = 'CanvasRenderer';

		}

		rendererPropertiesRow.setDisplay( type === 'WebGLRenderer' ? '' : 'none' );

		var renderer = new rendererTypes[ type ]( { antialias: antialias } );

		if ( shadows && renderer.shadowMap ) {

			renderer.shadowMap.enabled = true;
			// renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		}

		signals.rendererChanged.dispatch( renderer );

	}

	createRenderer( config.getKey( 'project/renderer' ), config.getKey( 'project/renderer/antialias' ), config.getKey( 'project/renderer/shadows' ) );

	return container;

};
