/*
    title: target-settings.js
    author: iann#4440
    description: min dmg, baim cond, avoid insafe cond, etc
*/
const name = Cheat.GetUsername();

// menu
UI.AddSubTab(["Config", "SUBTAB_MGR"], name);

const path = ["Config", name, "SHEET_MGR", name];
const hk_path = ["Config", "SUBTAB_MGR", "Scripts", "SHEET_MGR", "Keys", "JS Keybinds"];

const dmgkey = UI.AddHotkey(hk_path, "Damage Override", "Damage Override");

// data
const weapons = ["Pistol", "Awp", "Auto", "Scout", "Heavy Pistol"];
const tabs = UI.AddDropdown(path, "Weapon Category", weapons, 0);

const unsafehb = [], baim = [], dmg = [], noscopehc = [];
const currentWeapon, isOverride, damageValue, newValue = null;
const HCweapons, noScopeHCval, localPlayer, scopeStatus, targetHC = null;
const ticks = '64'
const body_opt = null;
const avoidHitboxes = null;

const entry = void function()
{
	Cheat.RegisterCallback("Draw", "menu");
	Cheat.RegisterCallback("CreateMove", 'updateMinDmg');
	Cheat.RegisterCallback('CreateMove', 'noScopeHC');
	Cheat.RegisterCallback('CreateMove', 'JumpHitchance');
	Cheat.RegisterCallback("CreateMove", 'toAvoid');
	Cheat.RegisterCallback("CreateMove", 'main');
}();

const duplicate = void function()
{
    for (var x in weapons) 
	{
        unsafehb[x] = UI.AddMultiDropdown(path, "[" + weapons[x] + "] Avoid Unsafe Hitboxes", ["Head", "Chest", "Stomach", "Arms", "Legs"], 0);
        baim[x] = UI.AddMultiDropdown(path, "[" + weapons[x] + "] Baim Conditions", ["Lethal", "Standing", "Crouching", "Slow-walking", "Running", "In-air"], 0);
        dmg[x] = UI.AddSliderInt(path, "[" + weapons[x] + "] Minimum Damage Override", 0, 100);
    }
    noscopehc = UI.AddSliderInt(path, "[" + weapons[2] + "] No-Scope Hitchance", 0, 100);
    scoutairhc = UI.AddSliderInt(path, "[" + weapons[3] + "] Air Hitchance", 0, 100);
    r8airhc = UI.AddSliderInt(path, "[" + weapons[4] + "] Air Hitchance", 0, 100);

}();

const menu = function() 
{
   const value = UI.GetValue(tabs);
    for (x in weapons) 
	{
        if (x == value) 
		{
            UI.SetEnabled(unsafehb[x], 1)
            UI.SetEnabled(baim[x], 1)
            UI.SetEnabled(dmg[x], 1)
        } 
		else 
		{
            UI.SetEnabled(unsafehb[x], 0)
            UI.SetEnabled(baim[x], 0)
            UI.SetEnabled(dmg[x], 0)
        }

        if (value == 2) {
            UI.SetEnabled(noscopehc, 1)
        } else {
            UI.SetEnabled(noscopehc, 0)
        }

        if (value == 3) {
            UI.SetEnabled(scoutairhc, 1)
        } else {
            UI.SetEnabled(scoutairhc, 0)
        }
        if (value == 4) {
            UI.SetEnabled(r8airhc, 1)
        } else {
            UI.SetEnabled(r8airhc, 0)
        }
    }
}

const updateMinDmg = function() 
{
    currentWeapon = Entity.GetName(Entity.GetWeapon(Entity.GetLocalPlayer()))
    isOverride = UI.GetValue(dmgkey) ? true : false;

    if (isOverride) 
	{
        switch (currentWeapon) 
		{
        default:
            newValue = null;
            break;
        case 'ssg 08':
            newValue = UI.GetValue(dmg[3])
            break;
        case 'awp':
            newValue = UI.GetValue(dmg[1])
            break;
        case 'scar 20':
            newValue = UI.GetValue(dmg[2])
            break;
        case 'g3sg1':
            newValue = UI.GetValue(dmg[2])
            break;
        case 'r8 revolver':
            newValue = UI.GetValue(dmg[4])
            break;
        case 'desert eagle':
            newValue = UI.GetValue(dmg[4])
            break;
        case 'usp s':
            newValue = UI.GetValue(dmg[0])
            break;
        case 'glock 18':
            newValue = UI.GetValue(dmg[0])
            break;
        case 'dual berettas':
            newValue = UI.GetValue(dmg[0])
            break;
        case 'p250':
            newValue = UI.GetValue(dmg[0])
            break;
        case 'tec 9':
            newValue = UI.GetValue(dmg[0])
            break;
        }
        const target = Entity.GetEnemies();
        for (var t in target) 
		{
            if (newValue != 0) 
			{
                Ragebot.ForceTargetMinimumDamage(target[t], newValue);
            }
        }
    }
}

const noScopeHC = function() 
{
    HCweapons = Entity.GetName(Entity.GetWeapon(Entity.GetLocalPlayer()));
    noScopeHCval = UI.GetValue(noscopehc);
    localPlayer = Entity.GetLocalPlayer();
    scopeStatus = Entity.GetProp(localPlayer, "CCSPlayer", "m_bIsScoped")
    targetHC = Ragebot.GetTarget();
    if ((HCweapons != 'g3sg1') && (HCweapons != 'scar 20'))
        return;
	
    if ((!scopeStatus) && (noScopeHCval != 0)) 
	{
        Ragebot.ForceTargetHitchance(targetHC, noScopeHCval);
    }
}


const JumpHitchance = function() 
{
    var weapons = Entity.GetName(Entity.GetWeapon(Entity.GetLocalPlayer()));
    var flags = Entity.GetProp(Entity.GetLocalPlayer(), 'CBasePlayer', 'm_fFlags');
    if (!(flags & 1 << 0) && !(flags & 1 << 18 && (weapons != 'ssg 08'))) 
	{
        target = Ragebot.GetTarget();
        scout_jump_hc = UI.GetValue(scoutairhc);
        if (scout_jump_hc != 0) {
            Ragebot.ForceTargetHitchance(target, scout_jump_hc);
        }
    } 
	else if (!(flags & 1 << 0) && !(flags & 1 << 18 && (weapons != 'r8 revolver'))) 
	{
        target = Ragebot.GetTarget();
        r8_jump_hc = UI.GetValue(r8airhc);

        if (r8_jump_hc != 0) {
            Ragebot.ForceTargetHitchance(target, scout_jump_hc);

        }
    }
}

const extrapolate_tick = function(entity, ticks, x, y, z) 
{
    velocity = Entity.GetProp(entity, "CBasePlayer", "m_vecVelocity[0]");
    new_pos = [x, y, z];
    new_pos[0] = new_pos[0] + velocity[0] * Globals.TickInterval() * ticks;
    new_pos[1] = new_pos[1] + velocity[1] * Globals.TickInterval() * ticks;
    new_pos[2] = new_pos[2] + velocity[2] * Globals.TickInterval() * ticks;
    return new_pos;
}

const is_lethal = function(entity) 
{
    local_player = Entity.GetLocalPlayer();
    eye_pos = Entity.GetEyePosition(local_player);
    extrapolated_location = extrapolate_tick(local_player, ticks, eye_pos[0], eye_pos[1], eye_pos[2]);
    entity_hp = Entity.GetProp(entity, "CBasePlayer", "m_iHealth");
    pelvis_pos = Entity.GetHitboxPosition(entity, 2);
    body_pos = Entity.GetHitboxPosition(entity, 3);
    thorax_pos = Entity.GetHitboxPosition(entity, 4);
    pelvis_trace = Trace.Bullet(local_player, entity, extrapolated_location, pelvis_pos);
    body_trace = Trace.Bullet(local_player, entity, extrapolated_location, body_pos);
    thorax_trace = Trace.Bullet(local_player, entity, extrapolated_location, thorax_pos);
    lethal_damage = Math.max(pelvis_trace[1], body_trace[1], thorax_trace[1]);
    if (lethal_damage > entity_hp) return true;
    else return false;
}

const get_condition = function(entity) 
{
    flags = Entity.GetProp(entity, "CBasePlayer", "m_fFlags");
    entity_velocity = Entity.GetProp(entity, "CBasePlayer", "m_vecVelocity[0]");
    entity_speed = Math.sqrt(entity_velocity[0] * entity_velocity[0] + entity_velocity[1] * entity_velocity[1]).toFixed(0);
    wpn_info = Entity.GetCCSWeaponInfo(entity);
    if (wpn_info == undefined) return;
    if (flags & 1 << 1) return "crouching";
    else if (!(flags & 1 << 0) && !(flags & 1 << 0x12)) return "in-air";
    else if (entity_speed <= 2) return "standing";
    else if (entity_speed >= wpn_info["max_speed"]) return "running";
    else if (entity_speed <= (wpn_info["max_speed"] / 2.6).toFixed(0)) return "slow-walking";
}

const force_head = function(entity) 
{
    local_player = Entity.GetLocalPlayer();
    head_pos = Entity.GetHitboxPosition(entity, 0);
    head_damage = Trace.Bullet(local_player, entity, Entity.GetEyePosition(local_player), head_pos);
    Ragebot.ForceTargetMinimumDamage(entity, head_damage[1]);
}

const force_body = function(entity) 
{
    Ragebot.IgnoreTargetHitbox(entity, 0);
}

const main = function() {
    var localWeapon = Entity.GetName(Entity.GetWeapon(Entity.GetLocalPlayer()))
    switch (localWeapon) {

    case "ssg 08":
        body_opt = UI.GetValue(baim[3]);
        break;

    case "awp":
        body_opt = UI.GetValue(baim[1]);
        break;
    case "scar 20":
        body_opt = UI.GetValue(baim[2]);

        break;
    case "g3sg1":
        body_opt = UI.GetValue(baim[2]);

        break;
    case "r8 revolver":
        body_opt = UI.GetValue(baim[4]);

        break;
    case "desert eagle":
        body_opt = UI.GetValue(baim[4]);

        break;
    case "usp s":
        body_opt = UI.GetValue(baim[0]);

        break;
    case "glock 18":
        body_opt = UI.GetValue(baim[0]);


        break;
    case "duel burettas":
        body_opt = UI.GetValue(baim[0]);


        break;
    case "p250":
        body_opt = UI.GetValue(baim[0]);

        break;
    case "tec 9":
        body_opt = UI.GetValue(baim[0]);
        break;
    default:
        body_opt = null;
    }
    var enemies = Entity.GetEnemies();
    for (i = 0; i < enemies.length; i++) {
        if (!Entity.IsValid(enemies[i]) || !Entity.IsAlive(enemies[i]) || Entity.IsDormant(enemies[i])) continue;
        if (body_opt & (1 << 0) && is_lethal(enemies[i]) || body_opt & (1 << 1) && get_condition(enemies[i]) == "standing" || body_opt & (1 << 2) && get_condition(enemies[i]) == "crouching" || body_opt & (1 << 3) && get_condition(enemies[i]) == "slow-walking" || body_opt & (1 << 4) && get_condition(enemies[i]) == "running" || body_opt & (1 << 5) && get_condition(enemies[i]) == "in-air") {
            if (localWeapon == "ssg 08") {
                force_body(enemies[i])
            } else {
                force_body(enemies[i])
            }
        }
    }
}

const toAvoid = function() 
{
    const avoidHitboxes = null;
    const localWeapon = Entity.GetName(Entity.GetWeapon(Entity.GetLocalPlayer()));
    switch (localWeapon) 
	{
    case "ssg 08":
        avoidHitboxes = UI.GetValue(unsafehb[3]);
        break;
    case "awp":
        avoidHitboxes = UI.GetValue(unsafehb[1]);
        break;
    case "scar 20":
        avoidHitboxes = UI.GetValue(unsafehb[2]);
        break;
    case "g3sg1":
        avoidHitboxes = UI.GetValue(unsafehb[2]);
        break;
    case "r8 revolver":
        avoidHitboxes = UI.GetValue(unsafehb[4]);
        break;
    case "desert eagle":
        avoidHitboxes = UI.GetValue(unsafehb[4]);
        break;
    case "usp s":
        avoidHitboxes = UI.GetValue(unsafehb[0]);
        break;
    case "glock 18":
        avoidHitboxes = UI.GetValue(unsafehb[0]);
        break;
    case "duel burettas":
        avoidHitboxes = UI.GetValue(unsafehb[0]);
        break;
    case "p250":
        avoidHitboxes = UI.GetValue(unsafehb[0]);
        break;
    case "tec 9":
        avoidHitboxes = UI.GetValue(unsafehb[0]);
        break;
    default:
        avoidHitboxes = null;
    }
    const enemies = Entity.GetEnemies();
    for (var i in enemies) 
	{
        if (!Entity.IsValid(enemies[i]) || !Entity.IsAlive(enemies[i]) || Entity.IsDormant(enemies[i])) continue;
        if (avoidHitboxes & (1 << 0)) 
		{
            Ragebot.ForceHitboxSafety(enemies[i], 0);
        }

        if (avoidHitboxes & (1 << 1)) 
		{
            Ragebot.ForceHitboxSafety(enemies[i], 5);
            Ragebot.ForceHitboxSafety(enemies[i], 6);
        }

        if (avoidHitboxes & (1 << 2)) 
		{
            Ragebot.ForceHitboxSafety(enemies[i], 3);
        }

        if (avoidHitboxes & (1 << 3)) 
		{
            Ragebot.ForceHitboxSafety(enemies[i], 13);
            Ragebot.ForceHitboxSafety(enemies[i], 14);
            Ragebot.ForceHitboxSafety(enemies[i], 15);
            Ragebot.ForceHitboxSafety(enemies[i], 16);
            Ragebot.ForceHitboxSafety(enemies[i], 17);
            Ragebot.ForceHitboxSafety(enemies[i], 18);

        }

        if (avoidHitboxes & (1 << 4)) 
		{
            Ragebot.ForceHitboxSafety(enemies[i], 7);
            Ragebot.ForceHitboxSafety(enemies[i], 8);
            Ragebot.ForceHitboxSafety(enemies[i], 9);
            Ragebot.ForceHitboxSafety(enemies[i], 10);
            Ragebot.ForceHitboxSafety(enemies[i], 11);
            Ragebot.ForceHitboxSafety(enemies[i], 12);
        }
    }
}
