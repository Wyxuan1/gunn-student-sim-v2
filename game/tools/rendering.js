/**
 * @Author: Edmund Lam <edl>
 * @Date:   21:59:40, 24-Nov-2018
 * @Filename: rendering.js
 * @Last modified by:   edl
 * @Last modified time: 00:13:10, 15-Dec-2018
 */

var Window = (function(){
  var self = {};

  self.height = 192;
  self.zoom = canv.height/self.height;
  self.width = canv.width/self.zoom;

  self.invis_canv = document.createElement('canvas');
  self.invis_canv_context = self.invis_canv.getContext('2d');

  function get_window_pos(){
    let xpos = Math.max(Math.min(0, self.width/2-mc.pos[0]), self.width-MAP_DATA[mc.map].back.width);
    if (MAP_DATA[mc.map].back.width < self.width){
      xpos-=(self.width-MAP_DATA[mc.map].back.width)/2;
    }
    let ypos = Math.max(Math.min(0, self.height/2-mc.pos[1]), self.height-MAP_DATA[mc.map].back.height);
    // if (MAP_DATA[mc.map].back.height < self.height){
    //   ypos-=(self.width-MAP_DATA[mc.map].back.width)/2;
    // }
    return [xpos, ypos];
  }

  function drawImage(im, xy){
    let x = xy[0];
    let y=xy[1];
    w_p = get_window_pos();
    context.drawImage(im, (w_p[0]+x)*self.zoom, (w_p[1]+y)*self.zoom, im.width*self.zoom, im.height*self.zoom);
  }

  self.render = function(){
    let win_pos = get_window_pos();
    drawImage(MAP_DATA[mc.map].back, [0, 0]);
    drawImage(mc.currAnim, mc.pos);
    drawImage(MAP_DATA[mc.map].front, [0, 0]);
  }

  self.get_map = function(){
    self.invis_canv_context.width = MAP_DATA[mc.map].map.width;
    self.invis_canv_context.height = MAP_DATA[mc.map].map.height;
    invis_canv_context.drawImage(MAP_DATA[mc.map].map, 0, 0);
  }

  return self;
}());

var Effects = (function(){
  var self = {};

  var Vars = {
    darken:{
      opacity:0,
      rate:0.05
    },
    text:{
      pos:0,
      num_frames:2,
      font_size:8*Window.zoom,
      box:{
        height:36*Window.zoom,
        width:144*Window.zoom,
        bottom_margin:12*Window.zoom,
        border_thicc:1.5*Window.zoom
      }
    }
  };

  self.darken = function(){
    Vars.darken.opacity+=Vars.darken.rate;
    if (Vars.darken.opacity>1.25){
      Vars.darken.rate*=-1;
      mc.map = Game.cmde[0];
      mc.pos = [Game.cmde[1], Game.cmde[2]];
      Game.cmde = null;
    }else if (Vars.darken.opacity<0){
      Vars.darken.opacity = 0;
      Vars.darken.rate*=-1;
      Game.curr_action_type="game";
    }
    context.fillStyle="rgba(0, 0, 0, "+Vars.darken.opacity+")"
    context.fillRect(0, 0, canv.width, canv.height);
    // context.stroke();
  }

  function draw_text_box(){
    context.fillStyle = "black";
    context.fillRect((Window.width*Window.zoom-Vars.text.box.width)/2,
      Window.height*Window.zoom-Vars.text.box.bottom_margin-Vars.text.box.height,
      Vars.text.box.width,
      Vars.text.box.height);
    context.beginPath();
    context.lineWidth = Vars.text.box.border_thicc.toString();
    context.strokeStyle = "white";
    context.rect((canv.width-Vars.text.box.width)/2,
      Window.height*Window.zoom-Vars.text.box.bottom_margin-Vars.text.box.height,
      Vars.text.box.width,
      Vars.text.box.height);
    context.stroke();
  }

  self.text = function(){
    draw_text_box();
    context.fillStyle = "white";
    context.font = Vars.text.font_size.toString()+"px VT323";
    let gp = ActionList.get_pos();
    if (typeof gp === 'string'){
      context.fillText(gp, (Window.width*Window.zoom-Vars.text.box.width)/2+Vars.text.box.border_thicc*1.5, Window.height*Window.zoom-Vars.text.box.bottom_margin-Vars.text.box.height+Vars.text.font_size);
    }
  }

  return self;
}());
