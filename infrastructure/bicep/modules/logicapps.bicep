@description('The name of the logic app')
param logicAppName string

@description('The location for the logic app')
param location string

@description('ConvertKit API key')
@secure()
param convertKitApiKey string = ''

@description('ConvertKit API secret')
@secure()
param convertKitApiSecret string = ''

@description('Tags for the logic app')
param tags object = {}

// Logic App for ConvertKit integration
resource logicApp 'Microsoft.Logic/workflows@2019-05-01' = {
  name: logicAppName
  location: location
  tags: tags
  properties: {
    state: 'Enabled'
    definition: {
      '$schema': 'https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#'
      contentVersion: '1.0.0.0'
      parameters: {
        convertKitApiKey: {
          defaultValue: convertKitApiKey
          type: 'SecureString'
        }
        convertKitApiSecret: {
          defaultValue: convertKitApiSecret
          type: 'SecureString'
        }
      }
      triggers: {
        manual: {
          type: 'Request'
          kind: 'Http'
          inputs: {
            schema: {
              type: 'object'
              properties: {
                email: {
                  type: 'string'
                }
                firstName: {
                  type: 'string'
                }
                lastName: {
                  type: 'string'
                }
                door: {
                  type: 'string'
                }
                planId: {
                  type: 'string'
                }
                tags: {
                  type: 'array'
                  items: {
                    type: 'string'
                  }
                }
              }
              required: [
                'email'
                'firstName'
              ]
            }
          }
        }
      }
      actions: {
        'Add_Subscriber_to_ConvertKit': {
          type: 'Http'
          inputs: {
            method: 'POST'
            uri: 'https://api.convertkit.com/v3/subscribers'
            headers: {
              'Content-Type': 'application/json'
            }
            body: {
              api_key: '@parameters(\'convertKitApiKey\')'
              email: '@{triggerBody()?[\'email\']}'
              first_name: '@{triggerBody()?[\'firstName\']}'
              fields: {
                last_name: '@{triggerBody()?[\'lastName\']}'
                door: '@{triggerBody()?[\'door\']}'
                plan_id: '@{triggerBody()?[\'planId\']}'
              }
              tags: '@triggerBody()?[\'tags\']'
            }
          }
          runAfter: {}
        }
        'Start_Email_Sequence': {
          type: 'Http'
          inputs: {
            method: 'POST'
            uri: 'https://api.convertkit.com/v3/sequences/@{if(equals(triggerBody()?[\'door\'], \'christian\'), \'CHRISTIAN_SEQUENCE_ID\', \'SECULAR_SEQUENCE_ID\')}/subscribe'
            headers: {
              'Content-Type': 'application/json'
            }
            body: {
              api_key: '@parameters(\'convertKitApiKey\')'
              email: '@{triggerBody()?[\'email\']}'
            }
          }
          runAfter: {
            'Add_Subscriber_to_ConvertKit': [
              'Succeeded'
            ]
          }
        }
        'Response': {
          type: 'Response'
          kind: 'Http'
          inputs: {
            statusCode: 200
            body: {
              success: true
              message: 'Successfully added to ConvertKit and started email sequence'
              subscriber_id: '@{body(\'Add_Subscriber_to_ConvertKit\')?[\'subscription\']?[\'id\']}'
            }
          }
          runAfter: {
            'Start_Email_Sequence': [
              'Succeeded'
            ]
          }
        }
        'Error_Response': {
          type: 'Response'
          kind: 'Http'
          inputs: {
            statusCode: 400
            body: {
              success: false
              message: 'Failed to process ConvertKit integration'
              error: '@{body(\'Add_Subscriber_to_ConvertKit\')}'
            }
          }
          runAfter: {
            'Add_Subscriber_to_ConvertKit': [
              'Failed'
            ]
          }
        }
      }
    }
    parameters: {
      convertKitApiKey: {
        value: convertKitApiKey
      }
      convertKitApiSecret: {
        value: convertKitApiSecret
      }
    }
  }
}

// Outputs
output logicAppName string = logicApp.name
output logicAppId string = logicApp.id
output triggerUrl string = listCallbackUrl('${logicApp.id}/triggers/manual', '2019-05-01').value
output accessEndpoint string = logicApp.properties.accessEndpoint
