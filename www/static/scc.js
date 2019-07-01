Array.matrix2 = function(numrows, numcols, initial) {
	var arr = [];
	for (var i = 0; i <= numrows; ++i) {
		var columns = [];
		for (var j = 0; j <= numcols; ++j) {
			columns[j] = initial;
		}
		arr[i] = columns;
	}
	return arr;
}

Array.matrix3 = function(numrows, numcols, numdepth, initial) {
	var arr = [];
	for (var i = 0; i <= numrows; ++i) {
		var columns = [];
		for (var j = 0; j <= numcols; ++j) {
			var depth = [];
			for (var k = 0; k <= numdepth; ++k) {
				depth[k] = initial;
			}
			columns[j] = depth;
		}
		arr[i] = columns;
	}
	return arr;
}

var gIsLoaded = false;

var maxFloors = 15;
var maxRooms = 15;
var maxItems = 20;

var aFloors = 0;
var aRooms = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var aItems = Array.matrix2(maxFloors,maxRooms,0);
//alert(aItems);

var currentFloor = 0;
var currentRoom = 1;
var currentItem = 1;

var totChannels = 12;

function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}

function unhideFloor() {
	//alert(f[1][1]);
	currentFloor++;
	currentRoom = 0;
	currentItem = 0;
	var id = "floor"+currentFloor.toString()
	//alert(id);
	var item = document.getElementById(id);
	item.className='unhidden';
}

function unhideRoom() {
	currentRoom++;
	currentItem = 0;
	var id = "room"+currentRoom.toString()+"floor"+currentFloor.toString()
	//alert(id);
	var item = document.getElementById(id);
	item.className='unhidden';
}

function unhideItem() {
	currentItem++;
	var id = "item"+currentItem.toString()+"room"+currentRoom.toString()+"floor"+currentFloor.toString();
	//alert(id);
	var item = document.getElementById(id);
	item.className='unhidden';
}

function lookupBinaryMode(b, name) {
    var b = parseInt(b);
    var name = "binary-" + name.split('-')[1];
	var result;
	for(var i = 0; i < Items.length; i++) {
		if(Items[i][0] === b) {
			result = Items[i][5];
			//alert(name + " - " + result);
			break;
		}
	}
	if( result == "switch" ) {
        document.forms["theForm"][name].value = "switch";
    } else if( result == "contact" ) {
        document.forms["theForm"][name].value = "contact";
    } else if( result == "rollershutter" ) {
        document.forms["theForm"][name].value = "rollershutter";
    } else {
        document.forms["theForm"][name].value = "other";
    }
}

function updateChannels(thing, name) {
    var name = "channel-" + name.split('-')[1];
    var burglarAlarm = "";
    //alert(thing + " - " + name)

	for (var i = 1; i <= 12; i++ ) {
		document.forms["theForm"][name+'.'+i].value = "";
	}

	for (var i = 0; i < Channels.length; i++ ) {
		if (Channels[i][0] == thing ) {
			id = Channels[i][1];
			desc = Channels[i][2];
			//alert(thing + " - " + id + " - " + desc);
			if (id.indexOf('burglar') != -1) {
			    burglarAlarm = desc;
			}

			if (id.indexOf('binary') != -1) {
			    document.forms["theForm"][name+'.1'].value = desc;
			} else if (id.indexOf('alarm') != -1 && id.indexOf('power') == -1 && id.indexOf('tamper') == -1) {
			    document.forms["theForm"][name+'.2'].value = desc;
			} else if (id.indexOf('tamper') != -1) {
			    document.forms["theForm"][name+'.3'].value = desc;
			} else if (id.indexOf('luminance') != -1) {
			    document.forms["theForm"][name+'.4'].value = desc;
			} else if (id.indexOf('battery') != -1) {
			    document.forms["theForm"][name+'.5'].value = desc;
			} else if (id.indexOf('temperature') != -1 && id.indexOf('color') == -1) {
			    document.forms["theForm"][name+'.6'].value = desc;
			} else if (id.indexOf('humidity') != -1) {
			    document.forms["theForm"][name+'.7'].value = desc;
			} else if (id.indexOf('dimmer') != -1) {
			    document.forms["theForm"][name+'.8'].value = desc;
			} else if (id.indexOf('color') != -1 && id.indexOf('temp') == -1 ) {
			    document.forms["theForm"][name+'.9'].value = desc;
			} else if (id.indexOf('color') != -1 && id.indexOf('temp') != -1 ) {
			    document.forms["theForm"][name+'.10'].value = desc;
			} else if (id.indexOf('vibration') != -1) {
			    document.forms["theForm"][name+'.11'].value = desc;
			} else if (id.indexOf('uv') != -1 || id.indexOf('ultraviolet') != -1) {
			    document.forms["theForm"][name+'.12'].value = desc;
			} else if (id.indexOf('door') != -1) {
			    document.forms["theForm"][name+'.1'].value = desc;
			}
		}
	}

    if (document.forms["theForm"][name+'.8'].value != "" && document.forms["theForm"][name+'.1'].value == "") {
        document.forms["theForm"][name+'.1'].value = document.forms["theForm"][name+'.8'].value;
    }

    if (document.forms["theForm"][name+'.2'].value != "" && document.forms["theForm"][name+'.1'].value == "") {
        document.forms["theForm"][name+'.1'].value = document.forms["theForm"][name+'.2'].value;
    }

    if (document.forms["theForm"][name+'.3'].value == "" && burglarAlarm != "") {
        document.forms["theForm"][name+'.3'].value = burglarAlarm;
    }
}

function remRow(div, id) {
    //alert( id );
    
    name = id.split("-")[0].substring(6,id.length)
//     alert( name );
    idx = id.split("-")[1]
    f = idx.split(".")[0]
    r = idx.split(".")[1]
    i = idx.split(".")[2]
//     alert( idx );
    
    if( name == "Floor" ) {
        if( confirm( "Deleting this floor will delete all the rooms and items within it. Delete floor?" )) {
            for( j=1; j<=maxRooms; j++ ) {
                rname = "divroom-"+f.toString()+"."+j.toString()+".0";
                if( document.getElementById(rname) != null ) {
                    rdiv = document.getElementById(rname);
//                     alert( rname );
                    while(rdiv.firstChild) {
                      rdiv.removeChild(rdiv.firstChild);
                    }
                }

                for( k=1; k<=maxItems; k++ ) {
                    iname = "divitem-"+f.toString()+"."+j.toString()+"."+k.toString();
                    if( document.getElementById(iname) != null ) {
                        idiv = document.getElementById(iname);
//                         alert( iname );
                        while(idiv.firstChild) {
                          idiv.removeChild(idiv.firstChild);
                        }
                    }
                }
            }

            while(div.firstChild) {
              div.removeChild(div.firstChild);
            }
        }
    } else if ( name == "Room" ) {
        if( confirm( "Deleting this room will delete all the items within it. Delete room?" )) { 
            for( t=1; t<=maxItems; t++ ) {
                iname = "divitem-"+f.toString()+"."+r.toString()+"."+t.toString();
                if( document.getElementById(iname) != null ) {
                    idiv = document.getElementById(iname);
                    while(idiv.firstChild) {
                      idiv.removeChild(idiv.firstChild);
                    }
                }
            }
            while(div.firstChild) {
              div.removeChild(div.firstChild);
            }
        }
    } else if ( name == "Item" ) {
        if( confirm( "Delete this item?" )) {
            while(div.firstChild) {
              div.removeChild(div.firstChild);
            }
        }
    }
}

function addNewFloor() {
	if( currentFloor >= maxFloors ) { return; }
	gIsLoaded = true;
   	currentFloor = aFloors + 1;
   	aFloors = currentFloor;
	currentRoom = 0;
	currentItem = 0;
	
	var container = document.getElementById("container");

	var div = document.createElement("div");
	div.id = "divfloor-" + currentFloor.toString() + ".0.0";
	container.appendChild(div);
	
	div.appendChild(document.createElement("br"));

	var span = document.createElement("span");
	span.style.fontFamily = "verdana,helvetica,sans";
	span.style.fontSize = "8pt";
	div.appendChild(span);

	var span = document.createElement("span");
	span.style = "font-weight: normal;color: #5c0099;";
// 	var text = document.createTextNode("FLOOR " + (currentFloor) + " ");
	var text = document.createTextNode("  ►");
	span.appendChild(text);
	div.appendChild(span);

	var sel = document.createElement("select");
	sel.name = "floor-" + currentFloor.toString() + ".0.0";
	sel.id = "floor-" + currentFloor.toString() + ".0.0";
	sel.style = "font-weight: bold;color: #5c0099;";
	sel.classList.add("tablebutton");
	div.appendChild(sel);
	var opt = document.createElement("option");
	opt.innerHTML = "--- select ---";
	opt.value = "";
	sel.appendChild(opt);
	for(var i = 0; i < Floors.length; i++) {
		opt = document.createElement("option");
		opt.innerHTML = Floors[i][2];
		opt.value = Floors[i][0];
		sel.appendChild(opt);
	}

	var input1 = document.createElement("input");
	input1.type = "button";
	input1.name = "addRoom-" + currentFloor.toString() + "." + currentRoom.toString() + ".0";
	input1.classList.add("tablebutton");
	input1.onclick = function() { insertNewRoom(this.name); };
	input1.value = "add room";
	div.appendChild(input1);

	var inputx = document.createElement("input");
	inputx.type = "button";
	inputx.id = "deleteFloor-" + currentFloor.toString() + ".0.0";
	inputx.classList.add("tablebutton");
	inputx.onclick = function() { remRow(this.parentNode, this.id); };
	inputx.value = "X";
	div.appendChild(inputx);

	div.appendChild(document.createElement("br"));
}

function addNewRoom(floor, room, mode) {
	if( aRooms[floor] >= maxRooms ) { return; }
    floor = parseInt(floor);
    room = parseInt(room);

    //alert( aItems[currentFloor][currentRoom] );
    //alert( aFloors + "\n" + aRooms);

    currentFloor = floor;
   	currentRoom = aRooms[floor] + 1;
   	aRooms[floor] = currentRoom;
	currentItem = 0;
  	//alert( "current: " + currentFloor + " - " + currentRoom + " - " + currentItem);


    var tRooms = 0;
    for( var i=1; i<=floor-1; i++ ) {
        tRooms = tRooms + aRooms[i];
//         alert( "tRooms: " + tRooms);
    }
    tRooms = tRooms + currentRoom;

    var tItems = 0;
    for( var i=1; i<=floor-1; i++ ) {
        for( var j=1; j<=maxRooms; j++ ) {
            tItems = tItems + aItems[i][j];
//             alert( "tItems1: " + tItems );
        }
    }
    
    for( var i=floor; i<=floor; i++ ) {
        for( var j=1; j<=currentRoom; j++ ) {
            tItems = tItems + aItems[i][j];
//             alert( "tItems2: " + tItems );
        }
    }
    tRows = tItems + tRooms + floor;
    
   	aItems[floor][room] = currentItem;
   	//alert( "aRooms: " + aRooms[1] + " - " + aRooms);
//    	alert( "aItems: " + aItems[1][0] + " - " + aItems);

//     alert( "t: " + tRows + " - " + floor + " - " + tRooms + " - " + tItems);
//     alert( "tRows: " + tRows + " - " + aRooms[floor] + " - " + currentRoom);
	var container = document.getElementById("container");

	var div = document.createElement("div");
	div.id = "divroom-" + currentFloor.toString() + "." + currentRoom.toString() + ".0";
	if( mode == 1 ) {
	    container.appendChild(div);
	} else {
        container.insertBefore(div, container.childNodes[tRows]);
    }
	
	var span = document.createElement("span");
	span.classList.add("tab1");
	div.appendChild(span);

	var span = document.createElement("span");
	span.style = "font-weight: normal;color: #5c0099;";
// 	var text = document.createTextNode("ROOM " + (currentRoom) + " ");
	var text = document.createTextNode("  •");
	span.appendChild(text);
	div.appendChild(span);

	var sel = document.createElement("select");
	sel.name = "room-" + currentFloor.toString() + "." + currentRoom.toString() + ".0";
	sel.id = "room-" + currentFloor.toString() + "." + currentRoom.toString() + ".0";
	sel.style = "font-weight: bold;color: #5c0099;";
	sel.classList.add("tablebutton");
	div.appendChild(sel);
	var opt = document.createElement("option");
	opt.innerHTML = "--- select ---";
	opt.value = "";
	sel.appendChild(opt);
	for(var i = 0; i < Rooms.length; i++) {
		opt = document.createElement("option");
		opt.innerHTML = Rooms[i][2];
		opt.value = Rooms[i][0];
		sel.appendChild(opt);
	}

	var input1 = document.createElement("input");
	input1.type = "button";
	input1.name = "addItem-" + currentFloor.toString() + "." + currentRoom.toString();
	input1.classList.add("tablebutton");
	input1.onclick = function() { insertNewItem(this.name); };
	input1.value = "add item";
	div.appendChild(input1);

	var inputx = document.createElement("input");
	inputx.type = "button";
	inputx.id = "deleteRoom-" + currentFloor.toString() + "." + currentRoom.toString() + ".0";
	inputx.classList.add("tablebutton");
	inputx.onclick = function() { remRow(this.parentNode, this.id); };
	inputx.value = "X";
	div.appendChild(inputx);

	div.appendChild(document.createElement("br"));
}

function addNewItem(floor, room, mode) {
	if( aItems[floor][room] >= maxItems ) { return; }
    floor = parseInt(floor);
    room = parseInt(room);
    
    //alert( floor + " - " + room );
    //alert( aItems[currentFloor][currentRoom] );
    //alert( aFloors + "\n" + aRooms);

   	currentFloor = floor;
    currentRoom = room;

    var tRooms = 0;
    for( var i=1; i<=floor-1; i++ ) {
        tRooms = tRooms + aRooms[i];
//         alert( "tRooms: " + tRooms );
    }
    tRooms = tRooms + room

   	currentItem = aItems[floor][room] + 1;
   	aItems[floor][room] = currentItem;

//     var tItems = 0;
//     for( var i=1; i<=floor; i++ ) {
//         for( var j=1; j<=room; j++ ) {
//             tItems = tItems + aItems[i][j];
//             alert( "tItems: " + tItems );
//         }
//     }
    var tItems = 0;
    for( var i=1; i<=floor-1; i++ ) {
        for( var j=1; j<=maxRooms; j++ ) {
            tItems = tItems + aItems[i][j];
//             alert( "tItems1: " + tItems );
        }
    }
    
    for( var i=floor; i<=floor; i++ ) {
        for( var j=1; j<=currentRoom; j++ ) {
            tItems = tItems + aItems[i][j];
//             alert( "tItems2: " + tItems );
        }
    }
   tRows = tItems + tRooms + floor;
   
//    	alert( "aItems: " + aItems[1][0] + " - " + aItems);

//     alert( "t: " + tRows + " - " + floor + " - " + tRooms + " - " + tItems);
//     alert( "tItems: " + tItems + " - " + currentItem);
	var container = document.getElementById("container");

	var div = document.createElement("div");
	div.id = "divitem-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString();
	//alert( currentFloor + " - " + currentRoom + " - " + aItems[currentFloor][currentRoom-1] + " - " + pos );

	if( mode == 1 ) {
	    container.appendChild(div);
	} else {
        container.insertBefore(div, container.childNodes[tRows]);
    }
	
	var span = document.createElement("span");
	span.classList.add("tab2");
	div.appendChild(span);

	var span = document.createElement("span");
	span.style = "font-weight: normal;color: #5c0099;";
// 	var text = document.createTextNode("ITEM " + currentItem + " ");
	var text = document.createTextNode("  -");
	span.appendChild(text);
	div.appendChild(span);

	var sel = document.createElement("select");
	sel.name = "item-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString();
	sel.id = "item-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString();
	sel.style = "font-weight: normal;color: #5c0099;";
	sel.classList.add("tablebutton");
	sel.oninput = function() { lookupBinaryMode(this.value, this.id); };
	div.appendChild(sel);
	var opt = document.createElement("option");
	opt.innerHTML = "-------- select item type --------";
	opt.value = "";
	sel.appendChild(opt);
	for(var i = 0; i < Items.length; i++) {
		opt = document.createElement("option");
		opt.innerHTML = Items[i][2];
		opt.value = Items[i][0];
		sel.appendChild(opt);
	}

	var inputx = document.createElement("input");
	inputx.type = "button";
	inputx.id = "deleteItem-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString();
	inputx.classList.add("tablebutton");
	inputx.onclick = function() { remRow(this.parentNode, this.id); };
	inputx.value = "X";
	div.appendChild(inputx);

	div.appendChild(document.createTextNode("  "));

	var sel = document.createElement("select");
	sel.name = "thing-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString();
	sel.id = "thing-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString();
	sel.style = "font-weight: normal;color: #5c0099;";
	sel.classList.add("tablebutton");
	sel.oninput = function() { updateChannels(this.value, this.id); };
	div.appendChild(sel);
	var opt = document.createElement("option");
	opt.innerHTML = "--------------------------- select thing for this item---------------------------";
	opt.value = "not-selected";
	sel.appendChild(opt);
	for(var i = 0; i < Things.length; i++) {
		opt = document.createElement("option");
		opt.innerHTML = Things[i];
		opt.value = Things[i];
		sel.appendChild(opt);
	}

	div.appendChild(document.createElement("br"));
	var span = document.createElement("span");
	span.classList.add("tab3");
	div.appendChild(span);

	div.appendChild(document.createTextNode(" Vacation mode(lights only)"));
	var sel = document.createElement("select");
	sel.name = "vaca-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString();
	sel.id = "vaca-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString();
	sel.classList.add("tablebutton");
	div.appendChild(sel);
	var opt = document.createElement("option");
	opt.innerHTML = "no";
	opt.value = "no";
	sel.appendChild(opt);
	var opt = document.createElement("option");
	opt.innerHTML = "YES";
	opt.value = "yes";
	sel.appendChild(opt);

	div.appendChild(document.createTextNode(" Binary mode"));
	var sel = document.createElement("select");
	sel.name = "binary-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString();
	sel.id = "binary-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString();
	sel.classList.add("tablebutton");
	div.appendChild(sel);
	var opt = document.createElement("option");
	opt.innerHTML = "other";
	opt.value = "other";
	sel.appendChild(opt);
	var opt = document.createElement("option");
	opt.innerHTML = "SWITCH";
	opt.value = "switch";
	sel.appendChild(opt);
	var opt = document.createElement("option");
	opt.innerHTML = "CONTACT";
	opt.value = "contact";
	sel.appendChild(opt);
	var opt = document.createElement("option");
	opt.innerHTML = "ROLLERSHUTTER";
	opt.value = "rollershutter";
	sel.appendChild(opt);

	div.appendChild(document.createElement("br"));
	var span = document.createElement("span");
	span.classList.add("tab3");
	div.appendChild(span);

	div.appendChild(document.createTextNode(" Excl. from alarm"));
	var sel = document.createElement("select");
	sel.name = "notForAlarm-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString();
	sel.id = "notForAlarm-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString();
	sel.classList.add("tablebutton");
	div.appendChild(sel);
	var opt = document.createElement("option");
	opt.innerHTML = "no";
	opt.value = "no";
	sel.appendChild(opt);
	var opt = document.createElement("option");
	opt.innerHTML = "YES";
	opt.value = "yes";
	sel.appendChild(opt);

	div.appendChild(document.createTextNode(" Use light for motion sensor"));
	var sel = document.createElement("select");
	sel.name = "forMotionSensor-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString();
	sel.id = "forMotionSensor-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString();
	sel.classList.add("tablebutton");
	div.appendChild(sel);
	var opt = document.createElement("option");
	opt.innerHTML = "no";
	opt.value = "no";
	sel.appendChild(opt);
	var opt = document.createElement("option");
	opt.innerHTML = "YES";
	opt.value = "yes";
	sel.appendChild(opt);

	div.appendChild(document.createTextNode(" Use motion sensor for light"));
	var sel = document.createElement("select");
	sel.name = "motionForLight-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString();
	sel.id = "motionForLight-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString();
	sel.classList.add("tablebutton");
	div.appendChild(sel);
	var opt = document.createElement("option");
	opt.innerHTML = "no";
	opt.value = "no";
	sel.appendChild(opt);
	var opt = document.createElement("option");
	opt.innerHTML = "YES";
	opt.value = "yes";
	sel.appendChild(opt);

	div.appendChild(document.createTextNode("  "));
	var input = document.createElement("input");
	input.type = "button";
	input.id = "showChls-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString();
	input.classList.add("tablebutton");
	input.onclick = function() { hideChannels(this.id); };
	input.value = "show channels ▼";
	div.appendChild(input);

// 	div.appendChild(document.createElement("br"));

	var input = document.createElement("input");
	input.type = "text";
	input.value = "";
	input.hidden = true;
	input.classList.add("tab3");
	input.name = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".1";
	input.id = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".1";
	input.placeholder = "Enter binary channel";
	input.classList.add("tablechannel");
	div.appendChild(input);

	var input = document.createElement("input");
	input.type = "text";
	input.value = "";
	input.hidden = true;
	input.name = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".2";
	input.id = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".2";
	input.placeholder = "Enter alarm channel";
	input.classList.add("tablechannel");
	div.appendChild(input);

	var input = document.createElement("input");
	input.type = "text";
	input.value = "";
	input.hidden = true;
	input.name = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".3";
	input.id = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".3";
	input.placeholder = "Enter tamper channel";
	input.classList.add("tablechannel");
	div.appendChild(input);

	var input = document.createElement("input");
	input.type = "text";
	input.value = "";
	input.hidden = true;
	input.name = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".4";
	input.id = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".4";
	input.placeholder = "Enter luminance channel";
	input.classList.add("tablechannel");
	div.appendChild(input);

	var input = document.createElement("input");
	input.type = "text";
	input.value = "";
	input.hidden = true;
	input.name = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".5";
	input.id = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".5";
	input.placeholder = "Enter battery channel";
	input.classList.add("tablechannel");
	div.appendChild(input);

// 	div.appendChild(document.createElement("br"));

	var input = document.createElement("input");
	input.type = "text";
	input.value = "";
	input.hidden = true;
	input.classList.add("tab3");
	input.name = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".6";
	input.placeholder = "Enter temp channel";
	input.id = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".6";
	input.classList.add("tablechannel");
	div.appendChild(input);

	var input = document.createElement("input");
	input.type = "text";
	input.value = "";
	input.hidden = true;
	input.name = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".7";
	input.placeholder = "Enter humidity channel";
	input.id = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".7";
	input.classList.add("tablechannel");
	div.appendChild(input);

	var input = document.createElement("input");
	input.type = "text";
	input.value = "";
	input.hidden = true;
	input.name = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".8";
	input.id = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".8";
	input.placeholder = "Enter dimmer channel";
	input.classList.add("tablechannel");
	div.appendChild(input);

	var input = document.createElement("input");
	input.type = "text";
	input.value = "";
	input.hidden = true;
	input.name = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".9";
	input.id = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".9";
	input.placeholder = "Enter color channel";
	input.classList.add("tablechannel");
	div.appendChild(input);

	var input = document.createElement("input");
	input.type = "text";
	input.value = "";
	input.hidden = true;
	input.name = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".10";
	input.id = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".10";
	input.placeholder = "Enter color temp channel";
	input.classList.add("tablechannel");
	div.appendChild(input);

// 	div.appendChild(document.createElement("br"));

	var input = document.createElement("input");
	input.type = "text";
	input.value = "";
	input.hidden = true;
	input.classList.add("tab3");
	input.name = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".11";
	input.id = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".11";
	input.placeholder = "Enter vibration channel";
	input.classList.add("tablechannel");
	div.appendChild(input);

	var input = document.createElement("input");
	input.type = "text";
	input.value = "";
	input.hidden = true;
	input.name = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".12";
	input.id = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".12";
	input.placeholder = "Enter UV channel";
	input.classList.add("tablechannel");
	div.appendChild(input);

	var input = document.createElement("input");
	input.type = "hidden";
	input.value = "";
	input.hidden = true;
	input.name = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".13";
	input.id = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".13";
	input.placeholder = "Enter additional channel";
	input.classList.add("tablechannel");
	div.appendChild(input);

	var input = document.createElement("input");
	input.type = "hidden";
	input.value = "";
	input.hidden = true;
	input.name = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".14";
	input.placeholder = "Enter additional channel";
	input.id = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".14";
	input.classList.add("tablechannel");
	div.appendChild(input);

	var input = document.createElement("input");
	input.type = "hidden";
	input.value = "";
	input.hidden = true;
	input.name = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".15";
	input.placeholder = "Enter additional channel";
	input.id = "channel-" + currentFloor.toString() + "." + currentRoom.toString() + "." + currentItem.toString() + ".15";
	input.classList.add("tablechannel");
	div.appendChild(input);

	//div.appendChild(document.createElement("span"));
	div.appendChild(document.createElement("br"));
	div.appendChild(document.createElement("br"));
	//container.appendChild(document.createElement("div"));
}

function setFloor() {
    //alert("now");
    document.getElementById('floor-1.0.0').value = '3';
	//document.getElementsByName('floor-1.0.0')[0].selectedIndex = 1;
	//document.getElementById('floor-1.0.0').options[3].selected = 'selected';
}

function setRoom() {
    //alert("now");
    document.getElementById('room-1.1.0').value = '3';
	//document.getElementsByName('floor-1.0.0')[0].selectedIndex = 1;
	//document.getElementById('room-1.1.0').options[3].selected = 'selected';
}

function setItem() {
    //alert("now");
    document.getElementById('item-1.1.1').value = '3';
	//document.getElementsByName('floor-1.0.0')[0].selectedIndex = 1;
	//document.getElementById('item-1.0.0').options[3].selected = 'selected';
}


function loadHomeModel() {
    var f = 0;
    var r = 0;
    var i = 0;
    var fnew = 0;
    var rnew = 0;
    var inew = 0;

	if( home != 0 ) {
        document.getElementById('homes').value = home;
	}
	
    //alert( Homeitems );
    for( var row = 0; row < Homeitems.length; row++ ) {
        fnew = Homeitems[row][6].split(".")[0];
        rnew = Homeitems[row][12].split(".")[1];
        inew = Homeitems[row][20].split(".")[2];
        
        //alert( f + " - " + r + " - " + i );
//         alert( fnew + " - " + rnew + " - " + inew );
//         alert( Homeitems[i][20] );
        
        
        if( fnew > f ) {
            addNewFloor();
            var fid = "floor-" + fnew.toString() + ".0.0";
//             alert( fid );
            document.getElementById(fid).value = Homeitems[row][1];
            
            r = 0;
            i = 0;
        }
        if ( rnew > r ) {
            addNewRoom(fnew, rnew, 1);
            var rid = "room-" + fnew.toString() + "." + rnew.toString() + ".0";
//             alert( rid );
            document.getElementById(rid).value = Homeitems[row][7];

            i = 0;
        }
        if ( inew > i ) {
            addNewItem(fnew, rnew, 1);
            var iidx = fnew.toString() + "." + rnew.toString() + "." + inew.toString();
            var iid = "item-" + iidx;
            var tid = "thing-" + iidx;
            var vid = "vaca-" + iidx;
            var bid = "binary-" + iidx;
            var notforalarm = "notForAlarm-" + iidx;
            var formotion = "forMotionSensor-" + iidx;
            var motionforlight = "motionForLight-" + iidx;
            var cid = "channel-" + iidx;
            //alert( iid );
            document.getElementById(iid).value = Homeitems[row][13];
            document.getElementById(tid).value = Homeitems[row][43];
            
            if( Homeitems[row][23] == 1 ) {
                //document.getElementById(vid).value = "yes";
                document.forms["theForm"][vid].value = "yes";
            } else {
                //document.getElementById(vid).value = "no";
                document.forms["theForm"][vid].value = "no";
            }

            if( Homeitems[row][18] == "switch" ) {
                //document.getElementById(vid).value = "yes";
                document.forms["theForm"][bid].value = "switch";
            } else if( Homeitems[row][18] == "contact" ) {
                //document.getElementById(vid).value = "no";
                document.forms["theForm"][bid].value = "contact";
            } else if( Homeitems[row][18] == "rollershutter" ) {
                //document.getElementById(vid).value = "no";
                document.forms["theForm"][bid].value = "rollershutter";
            } else if( Homeitems[row][18] == "other" ) {
                //document.getElementById(vid).value = "no";
                document.forms["theForm"][bid].value = "other";
            }
 
            if( Homeitems[row][40] == 1 ) {
                //document.getElementById(vid).value = "yes";
                document.forms["theForm"][notforalarm].value = "yes";
            } else {
                //document.getElementById(vid).value = "no";
                document.forms["theForm"][notforalarm].value = "no";
            }

            if( Homeitems[row][41] == 1 ) {
                //document.getElementById(vid).value = "yes";
                document.forms["theForm"][formotion].value = "yes";
            } else {
                //document.getElementById(vid).value = "no";
                document.forms["theForm"][formotion].value = "no";
            }

            if( Homeitems[row][42] == 1 ) {
                //document.getElementById(vid).value = "yes";
                document.forms["theForm"][motionforlight].value = "yes";
            } else {
                //document.getElementById(vid).value = "no";
                document.forms["theForm"][motionforlight].value = "no";
            }

                        
            document.getElementById(cid+".1").value = Homeitems[row][25];
            document.getElementById(cid+".2").value = Homeitems[row][26];
            document.getElementById(cid+".3").value = Homeitems[row][27];
            document.getElementById(cid+".4").value = Homeitems[row][28];
            document.getElementById(cid+".5").value = Homeitems[row][29];
            document.getElementById(cid+".6").value = Homeitems[row][30];
            document.getElementById(cid+".7").value = Homeitems[row][31];
            document.getElementById(cid+".8").value = Homeitems[row][32];
            document.getElementById(cid+".9").value = Homeitems[row][33];
            document.getElementById(cid+".10").value = Homeitems[row][34];
            document.getElementById(cid+".11").value = Homeitems[row][35];
            document.getElementById(cid+".12").value = Homeitems[row][36];
            document.getElementById(cid+".13").value = Homeitems[row][37];
            document.getElementById(cid+".14").value = Homeitems[row][38];
            document.getElementById(cid+".15").value = Homeitems[row][39];
        }
        
        f = fnew;
        r = rnew;
        i = inew;
    }
}


function insertNewRoom(name) {
    //alert(name.split("-")[1].split("."));
    
    var p = name.split("-")[1].split(".");
    var floor = parseInt(p[0]);
    var room = parseInt(p[1]);
    //alert( p + " - " + floor + " - " + room );
    
	addNewRoom(floor, room);
}


function insertNewItem(name) {
    //alert(name.split("-")[1].split("."));
    
    var p = name.split("-")[1].split(".");
    var floor = p[0];
    var room = p[1];
    var pos = parseInt(p[0]) + parseInt(p[1]);

	addNewItem(floor, room);
}

function confirmTheForm(msg) {
    return confirm( msg );
}

function checkTheForm(mode) {
    if( mode == "save" ) {
        // remove all chars from name except [0-9,A-Z,a-z,-_]
        if( document.getElementById('newHomeName') ) {
            oName = document.getElementById('newHomeName');
            oNameValue = oName.value;   
            oNameValue = oNameValue.replace(/([^\w\s-]+)/gi, "");
        } else {
            oNameValue = "";   
        }
        //alert('now: ' + document.getElementById('newHomeName') + ' - ' + oNameValue);

        var floorIsNull = false;
        var floorIsEmpty = false;
        var floorIsFound = false;
        var roomIsNull = false;
        var roomIsEmpty = false;
        var roomIsFound = false;
        var itemIsNull = false;
        var itemIsEmpty = false;
        var itemIsFound = false;
        var tFloors = [];
        var tRooms = [];
        var tItems = [];
        var fname = "";
        var rname = "";
        var name = "";
        var cName = "";
        var cVal = "";
        var floors = 0;
        var rooms = 0;
        var items = 0;
        
        // check floors
        for( var i=1; i<=aFloors; i++ ) {
            name = "floor-" + i.toString() + ".0.0";
            if( document.getElementById(name) != null ) {
                if( document.getElementById(name).value == "" ) {
                    floorIsEmpty = true;
                } else {
                    floorIsFound = true;
                }
            } else {
                floorIsNull = true;
            }
        }
    
        // check rooms
        for( var i=1; i<=aRooms.length; i++ ) {
            for( var j=1; j<=aRooms[i]; j++ ) {
                name = "room-" + i.toString() + "." + j.toString() + ".0";
                if( document.getElementById(name) != null ) {
                    if( document.getElementById(name).value == "" ) {
                        roomIsEmpty = true;
                    } else {
                        roomIsFound = true;
                    }
                } else {
                    roomIsNull = true;
                }
            }
        }
        
        // check items and unselected objects
        for( var i=1; i<=maxFloors; i++ ) {
            fname = "floor-" + i.toString() + ".0.0";
            if( document.getElementById(fname) != null ) {
                floors++;
            }

            for( var j=1; j<=maxRooms; j++ ) {
                rname = "room-" + i.toString() + "." + j.toString() + ".0";
                if( document.getElementById(rname) != null ) {
                    rooms++;
                }

                for( var k=1; k<=aItems[i][j]; k++ ) {
                    name = "item-" + i.toString() + "." + j.toString() + "." + k.toString();
                    cName = "channel-" + i.toString() + "." + j.toString() + "." + k.toString();
//                     alert( name + " - " + cName + " - " + i + " - " + j + " - " + k );
                    if( document.getElementById(name) != null ) {
                        items++;
                        if( document.getElementById(name).value == "" ) {
                            itemIsEmpty = true;
                        } else {
                            itemIsFound = true;
                        }

                        // remove all chars from channels except [0-9,A-Z,a-z,-_:]
                        for( var x=1; x<=15; x++ ) {
                            tName = cName + "." + x.toString();
                            cObj = document.getElementById(tName);
                            cVal = cObj.value;
                            cObj.value = cVal.replace(/([^\w\s-:]+)/gi, "");
                        }
                    } else {
                        itemIsNull = true;
                    }
                    
                }
            }
        }
        
//         alert( isNull + " - " + isEmpty + " - " + isFound + " - " + aFloors );
        if( floorIsEmpty || roomIsEmpty || itemIsEmpty || (items < rooms) || (rooms < floors)) {
            alert( "Please select all Floors, Rooms and Items, then click save again. Select '--Dummy--' " +
            "for each item type that you don't have installed yet." );
            return false;
        } else if( !floorIsFound || !roomIsFound || !itemIsFound) {
            alert( "Please add a Floor, Room and Item to your home first." );
            return false;
        }
    
        if( oNameValue == "" && document.getElementById('homes').value == "" ) {
            alert( "Please enter a new name for your home and click save." );
            return false;
        } else {
            gIsLoaded = false;
            return true;
        }
    } else if( mode == "load" ) {
        /* if( aFloors != 0 ) {
            if( confirm( "You have been editing your home. Click 'Cancel', then click 'save' to save your work. Or, Click 'OK' to continue loading and lose your current work." ) ) {
                if( document.getElementById('homes').value == "" ) {
                    alert( "Please select a saved home to load." );
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        } else { */
            if( document.getElementById('homes').value == "" ) {
                alert( "Please select a saved home to load." );
                return false;
            } else {
                return true;
            }
        //}
    } else if( mode == "delete" ) {
        if( document.getElementById('homes').value == "" ) {
            alert( "Please select a saved home to delete." );
            return false;
        } else {
            if( confirm( "Delete this home permanently from the database?" ) ) {
                gIsLoaded = false;
                return true;
            } else {
                return false;
            }
        }
    } else if( mode == "reset" ) {
        if( confirm( "This will delete everything in the current home and reset the page. It will not delete any homes you have saved. Are you sure?" ) ) {
            gIsLoaded = false;
            return true;
        } else {
            return false;
        }
    }
}

function checkMaintForm() {
    // remove all chars from channels except [0-9,A-Z,a-z,-_@.;]
    var fld = document.getElementById('email');
    var val = fld.value;
    fld.value = val.replace(/([^\w\s-@.;]+)/gi, "");
    
    return true;
}

function viewPW(id) {
    var fld = document.getElementById(id);
    if (fld.type == "password") {
        fld.type = "text";
    } else {
        fld.type = "password";
    }
}

function checkPWs() {
    var currpw = document.getElementById('currpw');
    var newpw1 = document.getElementById('newpw1');
    var newpw2 = document.getElementById('newpw2');
    
    
    if (currpw.value == "") {
        alert("Your current password is empty. Please type it now.");
        currpw.focus();
        return false;
    }

    if (newpw1.value == "") {
        alert("Your new password is empty. Please type it now.");
        newpw1.focus();
        return false;
    }

    if (newpw1.value.length < 7) {
        alert("Your new password is too short. It must be at least 7 characters. Please re-type it now.");
        newpw1.focus();
        return false;
    }

    if (newpw2.value == "") {
        alert("Your new password confirmation is empty. Please type it now.");
        newpw2.focus();
        return false;
    }

    if (newpw1.value != newpw2.value) {
        alert("Your new passwords don't match. Please re-enter.");
        newpw2.focus();
        return false;
    } else {
        return true;
    }
}

function checkPW(fld) {
    var newpw1val = fld.value;
    fld.value = fld.value.replace(/([^\w\s\`\~\!\@\#\$\%\^\&\*\(\)\-\_\+\=\[\{\]\}\:\;,\<.\>\/\?\'\";]+)/gi, "");
}

function hideChannels(id) {
    var id = id.split('-')[1];
    var name = "channel-" + id;
    
    if (document.getElementById(name+".1").hidden != true) {    
        for (i = 1; i <= totChannels; i++) {
            document.getElementById(name+"."+i).hidden = true;
        }

    	document.getElementById("showChls-"+id).value = "show channels ▼";
    } else {
        for (i = 1; i <= totChannels; i++) {
            document.getElementById(name+"."+i).hidden = false;
        }

    	document.getElementById("showChls-"+id).value = "hide channels ▲";
    }



}
/* function resetStatus() {
  document.getElementById("msgbox").value = "";
} */