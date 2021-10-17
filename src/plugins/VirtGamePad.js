/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2018 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser3-plugin-template/blob/master/LICENSE|MIT License}
*/

// Static variables
var UP_LOWER_BOUND = -7 * (Math.PI / 8);
var UP_UPPER_BOUND = -1 * (Math.PI / 8);
var DOWN_LOWER_BOUND = Math.PI / 8;
var DOWN_UPPER_BOUND = 7 * (Math.PI / 8);
var RIGHT_LOWER_BOUND = -3 * (Math.PI / 8);
var RIGHT_UPPER_BOUND = 3 * (Math.PI / 8);
var LEFT_LOWER_BOUND = 5 * (Math.PI / 8);
var LEFT_UPPER_BOUND = -5 * (Math.PI / 8);

var GAMESTICK = 0;
var GAMEPAD = 1;

var VirtGamePad = function (scene)
{
    //  The Scene that owns this plugin
    console.log('VirtGamePad owned by scene ' + scene.scene.key );
    this.scene = scene;
    this.systems = scene.sys;
    this.name = "VirtGamePad";

    // Class members
    this.input = null;//this.scene.input;
    this.joystick = null;
    this.joystickmap = null;
    this.joystickscale = null;
    this.joystick_pos = null;
    this.joystickPad = null;
    this.joystickPad_pos = null;
    this.joystickPoint = null;
    this.joystickPoint_delta = null;
    this.joystickRadius = null;
    this.joystickPointer = null;
    this.button = null;
    this.buttonmap = null;
    this.buttonscale = null;
    this.buttonPoint = null;
    this.buttonRadius = null;
    this.buttonisDown = null;
    
    // Polling for the joystick and button pushes
    //this.preUpdate = this.gamepadPoll.bind(this);

    //if (!scene.sys.settings.isBooted)
    //{
    //    scene.sys.events.once('boot', this.boot, this);
    //}
};

//  Static function called by the PluginFile Loader.
VirtGamePad.register = function (PluginManager)
{
    //  Register this plugin with the PluginManager, so it can be added to Scenes.

    //  The first argument is the name this plugin will be known as in the PluginManager. It should not conflict with already registered plugins.
    //  The second argument is a reference to the plugin object, which will be instantiated by the PluginManager when the Scene boots.
    //  The third argument is the local mapping. This will make the plugin available under `this.sys.base` and also `this.base` from a Scene if
    //  it has an entry in the InjectionMap.
    PluginManager.register('VirtGamePad', VirtGamePad, 'base');
};

VirtGamePad.prototype = {

    //  Called when the Plugin is booted by the PluginManager.
    //  If you need to reference other systems in the Scene (like the Loader or DisplayList) then set-up those references now, not in the constructor.
    boot: function ()
    {
        var eventEmitter = this.systems.events;

        //  Listening to the following events is entirely optional, although we would recommend cleanly shutting down and destroying at least.
        //  If you don't need any of these events then remove the listeners and the relevant methods too.

        eventEmitter.on('start', this.start, this);

        eventEmitter.on('preupdate', this.preUpdate, this);
        eventEmitter.on('update', this.update, this);
        eventEmitter.on('postupdate', this.postUpdate, this);

        eventEmitter.on('pause', this.pause, this);
        eventEmitter.on('resume', this.resume, this);

        eventEmitter.on('sleep', this.sleep, this);
        eventEmitter.on('wake', this.wake, this);

        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },
    addJoystick: function (x, 
                           y, 
                           scale, 
                           key) {
    
        // If we already have a joystick, return null
        if (this.joystick !== null) {
            return null;
        }
        this.joystickmap = key;
        // Add the joystick to the game
        this.joystick = this.scene.add.image(x, y, key[GAMESTICK]);
        //this.joystick.frame = 2;
        this.joystick.setOrigin(0.5);
        //this.joystick.anchor.set(0.5);
        //this.joystick.fixedToCamera = true;
        this.joystick.setScale(scale, scale);
        this.joystickPad = this.scene.add.image(x, y, key[GAMEPAD]);
        //this.joystickPad.frame = 3;
        this.joystickPad.setOrigin(0.5);
        //this.joystickPad.anchor.set(0.5);
        //this.joystickPad.fixedToCamera = true;
        this.joystickPad.setScale(scale, scale);
        this.joystickPoint = new Phaser.Geom.Point(x, y);

        this.joystick.setInteractive({ draggable: true });
        this.joystick.on('dragstart', 
            function (pointer, gameObject) {
                //console.log('dragstart');
            }
        , this);
        this.joystick.on('drag', 
            function (pointer,dragX,dragY, gameObject ) {
                this.testDistance(pointer,this);
            }
        , this);
        this.joystick.on('dragend', 
            function (pointer, gameObject, dropped ) {
                //pointer.position = Phaser.Geom.Point(gameObject.x, gameObject.y);
                //this.testDistance(this.joystickPoint,this);
                this.moveJoystick(this.joystickPoint,this)
            }
        , this);
        
        // Remember the coordinates of the joystick
        
        
        // Set up initial joystick properties
        this.joystick.properties = {
            inUse: false,
            up: false,
            down: false,
            left: false,
            right: false,
            x: 0,
            y: 0,
            distance: 0,
            angle: 0,
            rotation: 0
        };
        
        // Set the touch area as defined by the button's radius
        this.joystickRadius = scale * (this.joystick.width / 2);
        
        return this.joystick;    
    },
    addButton: function(x, 
                        y, 
                        scale, 
                        key) {
                                                                
        // If we already have a button, return null
        if (this.button !== null) {
            return null;
        }
                                                                
        // Add the button to the game
        this.buttonmap = key;
        this.buttonscale = scale;
        //this.button = this.game.add.button(x, y, key, null, this);
        
        this.button = this.scene.add.image(x, y, this.buttonmap[0]);
        
        //this.button.frame = 0;
        this.button.setOrigin(0.5);
        //this.button.fixedToCamera = true;
        this.button.setScale(this.buttonscale, this.buttonscale);
        
        this.button.setInteractive().on('pointerdown' , this.buttonDown);
        this.button.setInteractive().on('pointerup' , this.buttonUp);

        // Remember the coordinates of the button
        this.buttonPoint = new Phaser.Geom.Point(x, y);
        
        // Set up initial button state
        this.buttonisDown = false;
        
        // Set the touch area as defined by the button's radius
        this.buttonRadius = scale * (this.button.width / 2);
        
        return this.button;
    },
    buttonDown: function() {
        this.buttonisDown = true;
        this.scene.scene.get("DungeonScene").input.keyboard.emit('keydown-SPACE');
    },
    buttonUp: function() {
        this.buttonisDown = false;
        this.scene.scene.get("DungeonScene").input.keyboard.emit('keyup-SPACE');
    },

    testDistance: function(pointer, that) {
    
        var reset = true;
    
        // See if the pointer is over the joystick
        var d = Phaser.Math.Distance.BetweenPoints(that.joystickPoint, pointer.position); //that.joystickPoint.distance(pointer.position);
        if ((pointer.isDown) && ((pointer === that.joystickPointer) || 
            (d < that.joystickRadius))) {
            reset = false;
            that.joystick.properties.inUse = true;
            that.joystickPointer = pointer;
            this.moveJoystick(pointer.position, that);
        }
        return reset;
    },
    moveJoystick: function(point, that) {
        
        // Calculate x/y of pointer from joystick center
        var deltaX = point.x - that.joystickPoint.x;
		var deltaY = point.y - that.joystickPoint.y;
        
        // Get the angle (radians) of the pointer on the joystick
        var rotation = Phaser.Math.Angle.BetweenPoints(that.joystickPoint, point);//that.joystickPoint.angle(point);
        
        // Set bounds on joystick pad
        if (Phaser.Math.Distance.BetweenPoints(that.joystickPoint, point) //that.joystickPoint.distance(point)
        	 > that.joystickRadius) {
            deltaX = (deltaX === 0) ? 
                0 : Math.cos(rotation) * that.joystickRadius;
            deltaY = (deltaY === 0) ?
                0 : Math.sin(rotation) * that.joystickRadius;
        }
        
        // Normalize x/y
        that.joystick.properties.x = parseInt((deltaX / 
            that.joystickRadius) * 100, 10);
		that.joystick.properties.y = parseInt((deltaY  /
            that.joystickRadius) * 100, 10);
        
        // Set polar coordinates
        that.joystick.properties.rotation = rotation;
        that.joystick.properties.angle = (180 / Math.PI) * rotation;
        that.joystick.properties.distance = 
//            parseInt( (that.joystickPoint.distance(point) / 
            parseInt( (Phaser.Math.Distance.BetweenPoints(that.joystickPoint, point) / 
            that.joystickRadius) * 100, 10);
            
        // Set d-pad directions
        that.joystick.properties.up = ((rotation > UP_LOWER_BOUND) && 
            (rotation <= UP_UPPER_BOUND));
        that.joystick.properties.down = ((rotation > DOWN_LOWER_BOUND) && 
            (rotation <= DOWN_UPPER_BOUND));
        that.joystick.properties.right = ((rotation > RIGHT_LOWER_BOUND) && 
            (rotation <= RIGHT_UPPER_BOUND));
        that.joystick.properties.left = ((rotation > LEFT_LOWER_BOUND) || 
            (rotation <= LEFT_UPPER_BOUND));
            
        // Fix situation where left/right is true if X/Y is centered
        if ((that.joystick.properties.x === 0) && 
            (that.joystick.properties.y === 0)) {
            that.joystick.properties.right = false;
            that.joystick.properties.left = false;
        }
        
        // Move joystick pad images
        joystickPoint_delta = Phaser.Geom.Point(deltaX,deltaY)
        this.joystick.x = that.joystickPoint.x + deltaX;
        this.joystick.y = that.joystickPoint.y + deltaY;

        if (that.joystick.properties.left) {
        	this.scene.scene.get("DungeonScene").input.keyboard.emit('keydown-LEFT');
        } else {
            this.scene.scene.get("DungeonScene").input.keyboard.emit('keyup-LEFT');
        }

        if (that.joystick.properties.up) {
        	this.scene.scene.get("DungeonScene").input.keyboard.emit('keydown-UP');
        } else {
            this.scene.scene.get("DungeonScene").input.keyboard.emit('keyup-UP');
        }
        if (that.joystick.properties.right) {
            this.scene.scene.get("DungeonScene").input.keyboard.emit('keydown-RIGHT');
        } else {
            this.scene.scene.get("DungeonScene").input.keyboard.emit('keyup-RIGHT');
        }
        if (that.joystick.properties.down) {
            this.scene.scene.get("DungeonScene").input.keyboard.emit('keydown-DOWN');
        } else {
            this.scene.scene.get("DungeonScene").input.keyboard.emit('keyup-DOWN');
        }
    },
    //  A test method.
    test: function (name)
    {
        console.log('VirtGamePad says hello ' + name + '!');
    },
    //  A init method.
    init: function (name)
    {
        console.log('VirtGamePad inited scene ' +this.scene.key + ' name:'+  name + '!');
    },
    //  Called when a Scene is started by the SceneManager. The Scene is now active, visible and running.
    start: function ()
    {
    },

    //  Called every Scene step - phase 1
    preUpdate: function (time, delta)
    {
    	
    },

    //  Called every Scene step - phase 2
    update: function (time, delta)
    {
    },

    //  Called every Scene step - phase 3
    postUpdate: function (time, delta)
    {
    },

    //  Called when a Scene is paused. A paused scene doesn't have its Step run, but still renders.
    pause: function ()
    {
    },

    //  Called when a Scene is resumed from a paused state.
    resume: function ()
    {
    },

    //  Called when a Scene is put to sleep. A sleeping scene doesn't update or render, but isn't destroyed or shutdown. preUpdate events still fire.
    sleep: function ()
    {
    },

    //  Called when a Scene is woken from a sleeping state.
    wake: function ()
    {
    },

    //  Called when a Scene shuts down, it may then come back again later (which will invoke the 'start' event) but should be considered dormant.
    shutdown: function ()
    {
    },

    //  Called when a Scene is destroyed by the Scene Manager. There is no coming back from a destroyed Scene, so clear up all resources here.
    destroy: function ()
    {
        this.shutdown();

        this.scene = undefined;
    }

};

VirtGamePad.prototype.constructor = VirtGamePad;

//  Make sure you export the plugin for webpack to expose

module.exports = VirtGamePad;