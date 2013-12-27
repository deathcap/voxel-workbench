// Generated by CoffeeScript 1.6.3
(function() {
  var AmorphousRecipe, CraftingThesaurus, Inventory, InventoryWindow, ItemPile, Modal, PositionalRecipe, Recipe, RecipeLocator, Workbench, WorkbenchDialog, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Modal = require('voxel-modal');

  Inventory = require('inventory');

  InventoryWindow = require('inventory-window');

  ItemPile = require('itempile');

  _ref = require('craftingrecipes'), Recipe = _ref.Recipe, AmorphousRecipe = _ref.AmorphousRecipe, PositionalRecipe = _ref.PositionalRecipe, CraftingThesaurus = _ref.CraftingThesaurus, RecipeLocator = _ref.RecipeLocator;

  Workbench = (function() {
    function Workbench(game, opts) {
      var _ref1, _ref2;
      this.game = game;
      if (opts == null) {
        opts = {};
      }
      this.playerInventory = (function() {
        if ((_ref1 = opts.playerInventory) != null) {
          return _ref1;
        } else {
          throw 'voxel-workbench requires "playerInventory" set to inventory instance';
        }
      })();
      this.registry = (function() {
        var _ref3;
        if ((_ref2 = (_ref3 = game.plugins) != null ? _ref3.all.registry : void 0) != null) {
          return _ref2;
        } else {
          throw 'voxel-workbench requires "voxel-registry" plugin';
        }
      })();
      if (opts.registerBlock == null) {
        opts.registerBlock = true;
      }
      if (opts.registerRecipe == null) {
        opts.registerRecipe = true;
      }
      this.workbenchDialog = new WorkbenchDialog(game, opts);
      this.opts = opts;
      this.enable();
    }

    Workbench.prototype.enable = function() {
      var _this = this;
      if (this.opts.registerBlock) {
        this.registry.registerBlock('workbench', {
          texture: ['crafting_table_top', 'planks_oak', 'crafting_table_side'],
          onInteract: function() {
            _this.workbenchDialog.open();
            return true;
          }
        });
      }
      if (this.opts.registerRecipe) {
        return this.registry.recipes.register(new AmorphousRecipe(['wood.plank', 'wood.plank', 'wood.plank', 'wood.plank'], new ItemPile('workbench', 1)));
      }
    };

    Workbench.prototype.disable = function() {};

    return Workbench;

  })();

  WorkbenchDialog = (function(_super) {
    __extends(WorkbenchDialog, _super);

    function WorkbenchDialog(game, opts) {
      var crDiv, craftCont, resultCont, _ref1, _ref2,
        _this = this;
      this.game = game;
      if (opts == null) {
        opts = {};
      }
      this.playerInventory = (function() {
        if ((_ref1 = opts.playerInventory) != null) {
          return _ref1;
        } else {
          throw 'voxel-workbench requires "playerInventory" set to inventory instance';
        }
      })();
      this.registry = (function() {
        if ((_ref2 = opts.registry) != null) {
          return _ref2;
        } else {
          throw 'voxel-workbench requires "registry" set to voxel-registry instance';
        }
      })();
      this.playerIW = new InventoryWindow({
        width: 10,
        inventory: this.playerInventory
      });
      this.craftInventory = new Inventory(3, 3);
      this.craftInventory.on('changed', function() {
        return _this.updateCraftingRecipe();
      });
      this.craftIW = new InventoryWindow({
        width: 3,
        inventory: this.craftInventory
      });
      this.resultInventory = new Inventory(1);
      this.resultIW = new InventoryWindow({
        inventory: this.resultInventory,
        allowDrop: false
      });
      this.resultIW.on('pickup', function() {
        return _this.tookCraftingOutput();
      });
      this.dialog = document.createElement('div');
      this.dialog.style.border = '6px outset gray';
      this.dialog.style.visibility = 'hidden';
      this.dialog.style.position = 'absolute';
      this.dialog.style.top = '20%';
      this.dialog.style.left = '30%';
      this.dialog.style.zIndex = 1;
      this.dialog.style.backgroundImage = 'linear-gradient(rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.5) 100%)';
      document.body.appendChild(this.dialog);
      crDiv = document.createElement('div');
      crDiv.style.marginLeft = '30%';
      crDiv.style.marginBottom = '10px';
      craftCont = this.craftIW.createContainer();
      resultCont = this.resultIW.createContainer();
      resultCont.style.marginLeft = '30px';
      resultCont.style.marginTop = '15%';
      crDiv.appendChild(craftCont);
      crDiv.appendChild(resultCont);
      this.dialog.appendChild(crDiv);
      this.dialog.appendChild(document.createElement('br'));
      this.dialog.appendChild(this.playerIW.createContainer());
      WorkbenchDialog.__super__.constructor.call(this, game, {
        element: this.dialog
      });
    }

    WorkbenchDialog.prototype.updateCraftingRecipe = function() {
      var recipe;
      recipe = RecipeLocator.find(this.craftInventory);
      console.log('found recipe', recipe);
      return this.resultInventory.set(0, recipe != null ? recipe.computeOutput(this.craftInventory) : void 0);
    };

    WorkbenchDialog.prototype.tookCraftingOutput = function() {
      var recipe;
      recipe = RecipeLocator.find(this.craftInventory);
      if (recipe == null) {
        return;
      }
      recipe.craft(this.craftInventory);
      return this.craftInventory.changed();
    };

    return WorkbenchDialog;

  })(Modal);

  module.exports = function(game, opts) {
    return new Workbench(game, opts);
  };

  module.exports.pluginInfo = {
    loadAfter: ['registry']
  };

}).call(this);
