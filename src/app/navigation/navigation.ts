import { FuseNavigation } from '@fuse/types';

let menu:any [] = [];

if (false) {
    menu = [
        {
            id       : 'modulos',
            title    : 'Módulos de Administración',
            type     : 'group',
            children : [
                {
                    id       : 'dashboard',
                    title    : 'Inicio',
                    type     : 'item',
                    icon     : 'home',
                    url      : 'admin/dashboard',
                },
                {
                    id       : 'abonados',
                    title    : 'Abonados',
                    type     : 'item',
                    icon     : 'group',
                    url      : 'admin/abonados',
                }]
            }
        ]
}else{
   menu = [
        {
            id       : 'modulos',
            title    : 'Módulos de Administración',
            type     : 'group',
            children : [
                {
                    id       : 'dashboard',
                    title    : 'Inicio',
                    type     : 'item',
                    icon     : 'home',
                    url      : 'admin/dashboard',
                    // badge    : {
                    //     title    : '25',
                    //     translate: 'NAV.SAMPLE.BADGE',
                    //     bg       : '#F44336',
                    //     fg       : '#FFFFFF'
                    // }
                },
                {
                    id       : 'abonados',
                    title    : 'Abonados',
                    type     : 'item',
                    icon     : 'group',
                    url      : 'admin/abonados',
                },
                {
                    id       : 'medidores',
                    title    : 'Medidores',
                    type     : 'collapsable',
                    icon     : 'shutter_speed',
                    children :[
                        {
                            id       : 'asignarMedidor',
                            title    : 'Asignar un medidor',
                            type     : 'item',
                            icon     : 'redo',
                            url      : 'admin/buscar-medidor',
                        },
                        {
                            id       : 'listarMedidores',
                            title    : 'Listar Medidores',
                            type     : 'item',
                            icon     : 'format_align_justify',
                            url      : 'admin/medidores',
                        },
                    ]
                },
                {
                    id       : 'lecturas',
                    title    : 'Lecturas',
                    type     : 'collapsable',
                    icon     : 'dvr',
                    children :[
                        {
                            id       : 'ingrearLecturas',
                            title    : 'Registrar Lecturas',
                            type     : 'item',
                            icon     : 'create',
                            url      : 'admin/seleccionar-periodo/lecturas',
                        },
                        {
                            id       : 'listarLecturas',
                            title    : 'Listar Lecturas',
                            type     : 'item',
                            icon     : 'format_align_justify',
                            url      : 'admin/seleccionar-periodo/lecturas-todas',
                        },
                        {
                            id       : 'lecturasUnMedidor',
                            title    : 'Lecturas de un medidor',
                            type     : 'item',
                            icon     : 'filter_1',
                            url      : 'admin/seleccionar-medidor/lecturas',
                        },
                    ]
                },
                {
                    id       : 'recibos',
                    title    : 'Recibos',
                    type     : 'collapsable',
                    icon     : 'local_atm',
                    children :[
                        {
                            id       : 'pagarRecibos',
                            title    : 'Recibos por periodo',
                            type     : 'item',
                            icon     : 'date_range',
                            url      : 'admin/seleccionar-periodo/recibos',
                        },
                        {
                            id       : 'recibosDeUnAbonado',
                            title    : 'Recibos de un medidor',
                            type     : 'item',
                            icon     : 'contacts',
                            url      : 'admin/seleccionar-medidor/recibos',
                        }
                    ]
                },
            ]
        }
    ];
}

export const navigation: FuseNavigation[] = menu;
