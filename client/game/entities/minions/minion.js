var MinionEntity = Entity.extend( {

  init: function(producer, attrs) {
    settings = {};
    settings.image = MINIONTYPES[attrs.minionType].sprite;
    settings.spritewidth = 32;
    settings.spriteheight = 48;
    this.parent(0, 0, settings);

    this.defaultAnimationSet();

    this.collidable = true;

    customMerge(this, attrs, GAMECFG.minionFields);
    this.pos.x = attrs.posX || producer.pos.x;
    this.pos.y = attrs.posY || producer.pos.y;
    this.producer = producer;
    this.entType = MINIONTYPES[attrs.minionType].entType;
    this.damage = MINIONTYPES[attrs.minionType].damage;
    this.actionCooldownTime = MINIONTYPES[attrs.minionType].actionCooldownTime;
    this.isMinion = true;

    // Set Hp.  This value could come from some attribute set on the server side or
    // a default value from the config if no value is passed through attrs
    if (typeof this.maxHp === 'undefined') {
      this.maxHp = MINIONTYPES[attrs.minionType].baseHp;
    }
    if (typeof this.currHp === 'undefined') {
      this.currHp = this.maxHp;
    }
    
    // Set id and name of the entity.  This is done after init so that
    // we can grab the GUID set by melonJS
    this.setId();
  },

  setId: function() {
    this.id = this.id || this.GUID;
    this.name = MINIONTYPES[this.minionType].name + ' ' + this.id;
  },

  update: function() {
    this.parent(this);
    return true;
  },

  draw: function(context) {
    this.drawHp(context);
    this.parent(context);
  },
  
  onDestroyEvent: function() {
    // Drops either an ammo box or medkit
    var roll = parseInt(2 * Math.random(), 10);
    if (roll === 0) {
      this.dropItem(AmmoCollectible);
    } else {
      this.dropItem(MedkitCollectible);
    }
  },

  performAbility: function(target, ability) {
    if (typeof ability === 'undefined') {
      ability = { damage: this.damage };
    }
    var damage = this.performAttack(target, ability);
    return damage;
  },

  performAttack: function(target, attack) {
    var damage = this.parent(target, attack);
    return damage;
  }
});