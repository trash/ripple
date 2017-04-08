import {ISoundDataList} from '../interfaces';
export let sounds: ISoundDataList  = {
    purchase: {
        list: [
            'cash_1.wav',
            'cash_2.wav'
        ]
    },
    chopTree: {
        list :[
            // 'chp_tree_1.wav',
            // 'chp_tree_2.wav',
            'chp_tree_3.wav',
            'chp_tree_4.wav',
            // 'chp_tree_5.wav',
        ],
        throttle: 500
    },
    treeFall: {
        list :[
            'tree_fall_1.wav',
            'tree_fall_2.wav',
        ]
    },
    harvestFish: {
        list: [
            'fish_rod_1.wav',
            'fish_rod_2.wav',
        ]
    },
    mine: {
        list: [
            'mine_1.wav',
            'mine_2.wav',
            'mine_3.wav',
            'mine_4.wav',
        ]
    },
    mineDone: {
        list: [
            'mine_done_1.wav',
            'mine_done_2.wav'
        ]
    },
    harvestResource: {
        list: [
            'pick_bry_1.wav',
            'pick_bry_2.wav'
        ]
    },
    uiClick: {
        throttle: 1,
        list: [
            // 'UI_Click_1.wav',
            // 'UI_Click_2.wav',
            'UI_Click_3.wav',
            // 'UI_Click_4.wav',
        ]
    },
    clock1: {
        list: [
            'clk_1.wav'
        ]
    },
    clock2: {
        list: [
            'clk_2.wav'
        ]
    },
    clock3: {
        list: [
            'clk_3.wav'
        ]
    },
    clock4: {
        list: [
            'clk_4.wav'
        ]
    },
    clock5: {
        list: [
            'clk_5.wav'
        ]
    },
    placeBuilding: {
        // muteOnGameStart: true,
        list: [
            'plc_bld_1.wav',
            'plc_bld_2.wav',
            'plc_bld_3.wav',
        ]
    },
    construct: {
        list: [
            // 'constr_1.wav',
            'constr_2.wav',
            // 'constr_3.wav',
        ],
        throttle: 2000
    },
    farm: {
        list: [
            'farm_1.wav',
            'farm_2.wav',
            'farm_3.wav',
            'farm_4.wav',
            'farm_5.wav',
            'farm_6.wav',
        ]
    },
    farmDone: {
        list: [
            'farm_done_1.wav',
            'farm_done_2.wav',
        ]
    },
    agentAttacked: {
        list: [
            'hmn_atk_flsh_1.wav',
            'hmn_atk_flsh_2.wav'
        ]
    },
    buildingAttacked: {
        list: [
            'atk_bld_4.wav',
            'atk_bld_5.wav',
        ]
    },
    resourceDrop: {
        list: [
            'rsrc_drop_rock.wav',
            'rsrc_drop_wood.wav',
        ]
    },
    positiveThought: {
        muteOnGameStart: true,
        list: [
            'happy_1.wav',
            'happy_2.wav',
            'happy_3.wav',
            'happy_4.wav',
            'happy_5.wav',
        ]
    },
    negativeThought: {
        muteOnGameStart: true,
        list: [
            'upset_1.wav',
            'upset_2.wav',
            'upset_3.wav',
            'upset_4.wav',
            'upset_5.wav',
        ]
    }
};