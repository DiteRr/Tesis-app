jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({ goBack: jest.fn() }),
    useRoute: () => ({
      params: {
        'id': '91213168',
        'refresh_token': 'f0addde72af00b6a9c6aeb1671ce4bb4104ac852',
      }
    }),
  }));