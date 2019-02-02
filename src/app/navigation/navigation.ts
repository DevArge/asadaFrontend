import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
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
                icon     : 'watch',
                children :[
                    {
                        id       : 'ingrearLecturas',
                        title    : 'Registrar Lecturas',
                        type     : 'item',
                        icon     : 'vertical_align_bottom',
                        url      : 'admin/ingresar-lecturas',
                    },
                    {
                        id       : 'listarLecturas',
                        title    : 'Listar Lecturas',
                        type     : 'item',
                        icon     : 'format_align_justify',
                        url      : 'admin/lecturas',
                    },
                    {
                        id       : 'lecturasUnMedidor',
                        title    : 'Lecturas de un medidor',
                        type     : 'item',
                        icon     : 'format_align_justify',
                        url      : 'admin/lecturas-de-un-medidor',
                    },
                ]
            },
            {
                id       : 'recibos',
                title    : 'Recibos',
                type     : 'collapsable',
                icon     : 'watch',
                children :[
                    {
                        id       : 'pagarRecibos',
                        title    : 'Pagar Recibos',
                        type     : 'item',
                        icon     : 'vertical_align_bottom',
                        url      : 'admin/recibos',
                    },
                    {
                        id       : 'recibosDeUnAbonado',
                        title    : 'Recibos de un abonado',
                        type     : 'item',
                        icon     : 'format_align_justify',
                        url      : 'admin/recibos-de-un-abonado',
                    },
                    {
                        id       : 'recaudacion',
                        title    : 'Recaudación de recibos',
                        type     : 'item',
                        icon     : 'format_align_justify',
                        url      : 'admin/recaudacion',
                    },
                ]
            },
        ]
    }
];
