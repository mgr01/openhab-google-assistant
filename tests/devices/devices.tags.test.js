const OpenHAB = require('../../functions/openhab.js');
const Thermostat = require('../../functions/devices/thermostat.js');

describe('Test Switch Devices with Tags', () => {
  test('Switch Type', () => {
    const item = {
      type: 'Switch',
      state: 'ON',
      tags: [
        'Switchable'
      ]
    };
    const device = OpenHAB.getDeviceForItem(item);
    expect(device.name).toBe('Switch');
    expect(device.getState(item)).toStrictEqual({
      on: true
    });
  });

  test('Valve Switch Type', () => {
    const item = {
      type: 'Switch',
      state: 'ON',
      tags: [
        'Valve'
      ]
    };
    const device = OpenHAB.getDeviceForItem(item);
    expect(device.name).toBe('Valve');
    expect(device.getState(item)).toStrictEqual({
      openPercent: 100
    });
  });

  test('Sprinkler Switch Type', () => {
    const item = {
      type: 'Switch',
      state: 'ON',
      tags: [
        'Sprinkler'
      ]
    };
    const device = OpenHAB.getDeviceForItem(item);
    expect(device.name).toBe('Sprinkler');
    expect(device.getState(item)).toStrictEqual({
      isRunning: true,
      isPaused: false
    });
  });

  test('Lock Switch Type', () => {
    const item = {
      type: 'Switch',
      state: 'ON',
      tags: [
        'Lock'
      ]
    };
    const device = OpenHAB.getDeviceForItem(item);
    expect(device.name).toBe('Lock');
    expect(device.getState(item)).toStrictEqual({
      isLocked: true
    });
  });

  test('SecuritySystem Switch Type', () => {
    const item = {
      type: 'Switch',
      state: 'ON',
      tags: [
        'SecuritySystem'
      ]
    };
    const device = OpenHAB.getDeviceForItem(item);
    expect(device.name).toBe('SecuritySystem');
    expect(device.getState(item)).toStrictEqual({
      isArmed: true
    });
  });
});

describe('Test Light Devices with Tags', () => {
  test('Switch Light Type', () => {
    expect(OpenHAB.getDeviceForItem({
      type: 'Switch',
      tags: [
        'Lighting'
      ]
    }).name).toBe('SimpleLight');
  });

  test('Switch Group Light Type', () => {
    expect(OpenHAB.getDeviceForItem({
      type: 'Group',
      groupType: 'Switch',
      tags: [
        'Lighting'
      ]
    }).name).toBe('SimpleLight');
  });

  test('Dimmer Light Type', () => {
    expect(OpenHAB.getDeviceForItem({
      type: 'Dimmer',
      tags: [
        'Lighting'
      ]
    }).name).toBe('DimmableLight');
  });

  test('Dimmer Group Light Type', () => {
    expect(OpenHAB.getDeviceForItem({
      type: 'Group',
      groupType: 'Dimmer',
      tags: [
        'Lighting'
      ]
    }).name).toBe('DimmableLight');
  });

  test('Color Light Type', () => {
    expect(OpenHAB.getDeviceForItem({
      type: 'Color',
      tags: [
        'Lighting'
      ]
    }).name).toBe('ColorLight');
  });

  test('Color Group Light Type', () => {
    expect(OpenHAB.getDeviceForItem({
      type: 'Group',
      groupType: 'Color',
      tags: [
        'Lighting'
      ]
    }).name).toBe('ColorLight');
  });
});

describe('Test Rollershutter Devices with Tags', () => {
  test('Invalid Blinds Type', () => {
    expect(OpenHAB.getDeviceForItem({
      type: 'Dimmer',
      tags: [
        'Blinds'
      ]
    })).toBe(undefined);
  });

  test('Blinds Rollershutter Type', () => {
    const item = {
      type: 'Rollershutter',
      state: '0',
      tags: [
        'Blinds'
      ]
    };
    const device = OpenHAB.getDeviceForItem(item);
    expect(device.name).toBe('Blinds');
    expect(device.getState(item)).toStrictEqual({
      openPercent: 100
    });
  });
});

describe('Test Thermostat Device with Tags', () => {
  test('getDeviceForItem', () => {
    expect(OpenHAB.getDeviceForItem({
      type: 'Group',
      tags: [
        'Thermostat'
      ]
    }).name).toBe('Thermostat');

    expect(OpenHAB.getDeviceForItem({
      type: 'Switch',
      tags: [
        'Thermostat'
      ]
    })).toBe(undefined);

    expect(OpenHAB.getDeviceForItem({
      type: 'Group',
      tags: [
        'Something'
      ]
    })).toBe(undefined);
  });

  test('usesFahrenheit', () => {
    expect(Thermostat.usesFahrenheit({
      tags: [
        'Thermostat',
        'Fahrenheit'
      ]
    })).toBe(true);
  });

  test('getAttributes', () => {
    expect(Thermostat.getAttributes({
      tags: [
        'Thermostat',
        'Fahrenheit'
      ]
    })).toStrictEqual({
      'availableThermostatModes': 'off,heat,cool,on,heatcool,auto,eco',
      'thermostatTemperatureUnit': 'F',
    });

    expect(Thermostat.getAttributes({
      tags: [
        'Thermostat'
      ]
    })).toStrictEqual({
      'availableThermostatModes': 'off,heat,cool,on,heatcool,auto,eco',
      'thermostatTemperatureUnit': 'C',
    });
  });

  test('getState', () => {
    expect(Thermostat.getState({
      type: 'Group',
      tags: [
        'Thermostat'
      ]
    })).toStrictEqual({});

    expect(Thermostat.getState({
      type: 'Group',
      tags: [
        'Thermostat',
        'Fahrenheit'
      ],
      members: [{
        type: 'Number',
        tags: [
          'CurrentTemperature'
        ],
        state: '10'
      }, {
        type: 'Number',
        tags: [
          'TargetTemperature'
        ],
        state: '20'
      }, {
        type: 'Number',
        tags: [
          'HeatingCoolingMode'
        ],
        state: 'off'
      }]
    })).toStrictEqual({
      'thermostatTemperatureAmbient': -12.2,
      'thermostatTemperatureSetpoint': -6.7,
      'thermostatMode': 'off'
    });

    expect(Thermostat.getState({
      type: 'Group',
      tags: [
        'Thermostat'
      ],
      members: [{
        type: 'Number',
        tags: [
          'CurrentTemperature'
        ],
        state: '10'
      }, {
        type: 'Number',
        tags: [
          'TargetTemperature'
        ],
        state: '20'
      }, {
        type: 'Number',
        tags: [
          'HeatingCoolingMode'
        ],
        state: 'heat'
      }, {
        type: 'Number',
        tags: [
          'CurrentHumidity'
        ],
        state: '50'
      }]
    })).toStrictEqual({
      'thermostatTemperatureAmbient': 10,
      'thermostatTemperatureSetpoint': 20,
      'thermostatMode': 'heat',
      'thermostatHumidityAmbient': 50,
    });
  });
});