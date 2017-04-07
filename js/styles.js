import theme from './themes/base-theme';

export default {
    container: {
        flex: 1,
        width: null,
        height: null,
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal1: {
        height: 300,
    },
    view : {
        flex: 1, alignSelf: 'stretch', justifyContent: 'center', padding: 20
    },
    text: {
        color: theme.brandPrimary,
        textAlign: 'center',
        marginBottom: 15,
        fontSize: 15,
    },
};
