import React, {useState, useEffect} from 'react';
import {Box, Flex} from 'theme-ui';
import {Button, Card, Alert, Spin, message, Input, Divider} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  InfoCircleOutlined,
  ShopOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import {
  fetchBusinessContext,
  createBusinessContext,
  updateBusinessContext,
} from '../../api';
import {BusinessContext} from '../../types';
import {colors, Container, Title, Text} from '../common';

const {TextArea} = Input;

interface Service {
  name: string;
  description: string;
  price?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const BusinessContextSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasExistingContext, setHasExistingContext] = useState(false);
  const [businessContext, setBusinessContext] = useState<
    Partial<BusinessContext>
  >({
    business_name: '',
    business_description: '',
    services: {},
    scheduling_link: '',
    faqs: {},
    additional_context: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBusinessContext();
  }, []);

  const loadBusinessContext = async () => {
    try {
      setLoading(true);
      const context = await fetchBusinessContext();
      setBusinessContext(context);
      setHasExistingContext(true);
    } catch (err: unknown) {
      console.error('Failed to load business context:', err);
      // If no business context exists yet, that's okay - we'll start with empty form
      if ((err as any)?.status === 404) {
        console.log('No business context found, starting with empty form');
        setError(null);
        setHasExistingContext(false);
      } else {
        setError('Failed to load business context');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      if (hasExistingContext) {
        await updateBusinessContext(businessContext);
      } else {
        await createBusinessContext(businessContext);
        setHasExistingContext(true);
      }
      message.success('Business context saved successfully!');
    } catch (err) {
      console.error('Failed to save business context:', err);
      setError('Failed to save business context');
      message.error('Failed to save business context');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setBusinessContext((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addService = () => {
    const services = businessContext.services || {};
    const newKey = `service_${Date.now()}`;
    const newServices = {
      ...services,
      [newKey]: {name: '', description: '', price: ''},
    };
    updateField('services', newServices);
  };

  const updateService = (key: string, field: keyof Service, value: string) => {
    const services = businessContext.services || {};
    const newServices = {
      ...services,
      [key]: {...services[key], [field]: value},
    };
    updateField('services', newServices);
  };

  const removeService = (key: string) => {
    const services = businessContext.services || {};
    const {[key]: removed, ...newServices} = services;
    updateField('services', newServices);
  };

  const addFAQ = () => {
    const faqs = businessContext.faqs || {};
    const newKey = `faq_${Date.now()}`;
    const newFAQs = {...faqs, [newKey]: {question: '', answer: ''}};
    updateField('faqs', newFAQs);
  };

  const updateFAQ = (key: string, field: keyof FAQ, value: string) => {
    const faqs = businessContext.faqs || {};
    const newFAQs = {...faqs, [key]: {...faqs[key], [field]: value}};
    updateField('faqs', newFAQs);
  };

  const removeFAQ = (key: string) => {
    const faqs = businessContext.faqs || {};
    const {[key]: removed, ...newFAQs} = faqs;
    updateField('faqs', newFAQs);
  };

  if (loading) {
    return (
      <Container
        sx={{maxWidth: 900, paddingTop: '48px', paddingBottom: '48px'}}
      >
        <Flex
          sx={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
          }}
        >
          <Spin size="large" />
          <Text type="secondary" style={{marginTop: '20px', fontSize: '15px'}}>
            Loading business context...
          </Text>
        </Flex>
      </Container>
    );
  }

  return (
    <Container
      sx={{
        maxWidth: 1200,
        paddingTop: '32px',
        paddingBottom: '32px',
        alignItems: 'center',
      }}
    >
      <Box mb={4} sx={{width: '100%', maxWidth: 1200}}>
        <Title
          level={2}
          style={{fontSize: '28px', fontWeight: 600, marginBottom: '6px'}}
        >
          Business Context
        </Title>
        <Text
          type="secondary"
          style={{fontSize: '14px', color: colors.textMuted}}
        >
          Configure your business information to help the AI assistant provide
          better responses.
        </Text>
      </Box>

      {error && (
        <Box mb={4} sx={{width: '100%', maxWidth: 1200}}>
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{
              borderRadius: '8px',
              border: `1px solid ${colors.red}`,
            }}
          />
        </Box>
      )}

      <Flex
        sx={{
          gap: '24px',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          width: '100%',
          maxWidth: 1200,
          justifyContent: 'center',
        }}
      >
        <Box sx={{flex: 1, minWidth: '400px'}}>
          <Card
            style={{
              marginBottom: '24px',
              borderRadius: '12px',
              border: `1px solid ${colors.border}`,
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            }}
          >
            <Box mb={3}>
              <Flex
                sx={{alignItems: 'center', gap: '8px', marginBottom: '2px'}}
              >
                <ShopOutlined style={{fontSize: 16, color: colors.primary}} />
                <Title
                  level={4}
                  style={{margin: 0, fontSize: '16px', fontWeight: 600}}
                >
                  Basic Information
                </Title>
              </Flex>
            </Box>

            <Divider
              style={{margin: '16px 0', borderColor: colors.borderLight}}
            />

            <Box mb={3}>
              <Box mb={1}>
                <Text
                  strong
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: colors.textPrimary,
                  }}
                >
                  Business Name <span style={{color: colors.red}}>*</span>
                </Text>
              </Box>
              <Input
                value={businessContext.business_name || ''}
                onChange={(e) => updateField('business_name', e.target.value)}
                placeholder="Enter your business name"
                style={{fontSize: '14px'}}
              />
            </Box>

            <Box mb={3}>
              <Box mb={1}>
                <Text
                  strong
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: colors.textPrimary,
                  }}
                >
                  Business Description
                </Text>
              </Box>
              <TextArea
                value={businessContext.business_description || ''}
                onChange={(e) =>
                  updateField('business_description', e.target.value)
                }
                placeholder="Describe your business, what you do, and what makes you unique"
                rows={4}
                style={{fontSize: '14px'}}
              />
            </Box>

            <Box>
              <Box mb={1}>
                <Flex sx={{alignItems: 'center', gap: '6px'}}>
                  <CalendarOutlined
                    style={{fontSize: 12, color: colors.textMuted}}
                  />
                  <Text
                    strong
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: colors.textPrimary,
                    }}
                  >
                    Scheduling Link
                  </Text>
                </Flex>
              </Box>
              <Input
                value={businessContext.scheduling_link || ''}
                onChange={(e) => updateField('scheduling_link', e.target.value)}
                placeholder="https://calendly.com/your-company"
                style={{fontSize: '14px'}}
              />
            </Box>
          </Card>

          <Card
            style={{
              marginBottom: '24px',
              borderRadius: '12px',
              border: `1px solid ${colors.border}`,
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            }}
          >
            <Box mb={3}>
              <Flex
                sx={{alignItems: 'center', gap: '8px', marginBottom: '2px'}}
              >
                <FileTextOutlined
                  style={{fontSize: 16, color: colors.primary}}
                />
                <Title
                  level={4}
                  style={{margin: 0, fontSize: '16px', fontWeight: 600}}
                >
                  Additional Context
                </Title>
              </Flex>
            </Box>

            <Divider
              style={{margin: '16px 0', borderColor: colors.borderLight}}
            />

            <TextArea
              value={businessContext.additional_context || ''}
              onChange={(e) =>
                updateField('additional_context', e.target.value)
              }
              placeholder="Include information about policies, procedures, special instructions..."
              rows={5}
              style={{fontSize: '14px'}}
            />
          </Card>
        </Box>

        <Box sx={{flex: 1, minWidth: '400px'}}>
          <Card
            style={{
              marginBottom: '24px',
              borderRadius: '12px',
              border: `1px solid ${colors.border}`,
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            }}
          >
            <Box mb={3}>
              <Flex
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '2px',
                }}
              >
                <Flex sx={{alignItems: 'center', gap: '8px'}}>
                  <ShopOutlined style={{fontSize: 16, color: colors.primary}} />
                  <Title
                    level={4}
                    style={{margin: 0, fontSize: '16px', fontWeight: 600}}
                  >
                    Services
                  </Title>
                </Flex>
                <Button
                  type="default"
                  icon={<PlusOutlined />}
                  onClick={addService}
                  size="small"
                  style={{
                    borderRadius: '8px',
                    fontWeight: 500,
                  }}
                >
                  Add Service
                </Button>
              </Flex>
            </Box>

            {Object.keys(businessContext.services || {}).length === 0 ? (
              <Box
                sx={{
                  padding: '32px 20px',
                  textAlign: 'center',
                  backgroundColor: colors.bgSurface,
                  borderRadius: '8px',
                  border: `1px dashed ${colors.border}`,
                }}
              >
                <InfoCircleOutlined
                  style={{
                    fontSize: 24,
                    color: colors.textMuted,
                    marginBottom: '8px',
                  }}
                />
                <Text
                  type="secondary"
                  style={{
                    fontSize: '13px',
                    color: colors.textMuted,
                    display: 'block',
                  }}
                >
                  No services added yet
                </Text>
              </Box>
            ) : (
              <>
                <Divider
                  style={{margin: '16px 0', borderColor: colors.borderLight}}
                />
                {Object.entries(businessContext.services || {}).map(
                  ([key, service], index) => (
                    <Box
                      key={key}
                      mb={2}
                      sx={{
                        padding: '16px',
                        backgroundColor: colors.bgSurface,
                        borderRadius: '8px',
                        border: `1px solid ${colors.borderLight}`,
                        '&:last-child': {
                          marginBottom: 0,
                        },
                      }}
                    >
                      <Flex
                        sx={{
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px',
                        }}
                      >
                        <Text
                          strong
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: colors.textPrimary,
                          }}
                        >
                          Service {index + 1}
                        </Text>
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => removeService(key)}
                          style={{
                            color: colors.textMuted,
                            fontSize: '12px',
                          }}
                        >
                          Remove
                        </Button>
                      </Flex>

                      <Flex sx={{gap: '12px', flexWrap: 'wrap'}}>
                        <Box sx={{flex: 1, minWidth: '200px'}}>
                          <Box mb={1}>
                            <Text
                              style={{
                                fontSize: '12px',
                                fontWeight: 500,
                                color: colors.textSecondary,
                              }}
                            >
                              Name
                            </Text>
                          </Box>
                          <Input
                            value={service.name}
                            onChange={(e) =>
                              updateService(key, 'name', e.target.value)
                            }
                            placeholder="Service name"
                            style={{fontSize: '14px'}}
                          />
                        </Box>

                        <Box sx={{flex: 1, minWidth: '200px'}}>
                          <Box mb={1}>
                            <Text
                              style={{
                                fontSize: '12px',
                                fontWeight: 500,
                                color: colors.textSecondary,
                              }}
                            >
                              Price
                            </Text>
                          </Box>
                          <Input
                            value={service.price || ''}
                            onChange={(e) =>
                              updateService(key, 'price', e.target.value)
                            }
                            placeholder="e.g., $100/hour"
                            style={{fontSize: '14px'}}
                          />
                        </Box>
                      </Flex>

                      <Box mt={2}>
                        <Box mb={1}>
                          <Text
                            style={{
                              fontSize: '12px',
                              fontWeight: 500,
                              color: colors.textSecondary,
                            }}
                          >
                            Description
                          </Text>
                        </Box>
                        <TextArea
                          value={service.description}
                          onChange={(e) =>
                            updateService(key, 'description', e.target.value)
                          }
                          placeholder="Describe what this service includes"
                          rows={2}
                          style={{fontSize: '14px'}}
                        />
                      </Box>
                    </Box>
                  )
                )}
              </>
            )}
          </Card>

          <Card
            style={{
              marginBottom: '24px',
              borderRadius: '12px',
              border: `1px solid ${colors.border}`,
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            }}
          >
            <Box mb={3}>
              <Flex
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '2px',
                }}
              >
                <Flex sx={{alignItems: 'center', gap: '8px'}}>
                  <QuestionCircleOutlined
                    style={{fontSize: 16, color: colors.primary}}
                  />
                  <Title
                    level={4}
                    style={{margin: 0, fontSize: '16px', fontWeight: 600}}
                  >
                    FAQs
                  </Title>
                </Flex>
                <Button
                  type="default"
                  icon={<PlusOutlined />}
                  onClick={addFAQ}
                  size="small"
                  style={{
                    borderRadius: '8px',
                    fontWeight: 500,
                  }}
                >
                  Add FAQ
                </Button>
              </Flex>
            </Box>

            {Object.keys(businessContext.faqs || {}).length === 0 ? (
              <Box
                sx={{
                  padding: '32px 20px',
                  textAlign: 'center',
                  backgroundColor: colors.bgSurface,
                  borderRadius: '8px',
                  border: `1px dashed ${colors.border}`,
                }}
              >
                <QuestionCircleOutlined
                  style={{
                    fontSize: 24,
                    color: colors.textMuted,
                    marginBottom: '8px',
                  }}
                />
                <Text
                  type="secondary"
                  style={{
                    fontSize: '13px',
                    color: colors.textMuted,
                    display: 'block',
                  }}
                >
                  No FAQs added yet
                </Text>
              </Box>
            ) : (
              <>
                <Divider
                  style={{margin: '16px 0', borderColor: colors.borderLight}}
                />
                {Object.entries(businessContext.faqs || {}).map(
                  ([key, faq], index) => (
                    <Box
                      key={key}
                      mb={2}
                      sx={{
                        padding: '16px',
                        backgroundColor: colors.bgSurface,
                        borderRadius: '8px',
                        border: `1px solid ${colors.borderLight}`,
                        '&:last-child': {
                          marginBottom: 0,
                        },
                      }}
                    >
                      <Flex
                        sx={{
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px',
                        }}
                      >
                        <Text
                          strong
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: colors.textPrimary,
                          }}
                        >
                          FAQ {index + 1}
                        </Text>
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => removeFAQ(key)}
                          style={{
                            color: colors.textMuted,
                            fontSize: '12px',
                          }}
                        >
                          Remove
                        </Button>
                      </Flex>

                      <Box mb={2}>
                        <Box mb={1}>
                          <Text
                            style={{
                              fontSize: '12px',
                              fontWeight: 500,
                              color: colors.textSecondary,
                            }}
                          >
                            Question
                          </Text>
                        </Box>
                        <Input
                          value={faq.question}
                          onChange={(e) =>
                            updateFAQ(key, 'question', e.target.value)
                          }
                          placeholder="e.g., What are your business hours?"
                          style={{fontSize: '14px'}}
                        />
                      </Box>

                      <Box>
                        <Box mb={1}>
                          <Text
                            style={{
                              fontSize: '12px',
                              fontWeight: 500,
                              color: colors.textSecondary,
                            }}
                          >
                            Answer
                          </Text>
                        </Box>
                        <TextArea
                          value={faq.answer}
                          onChange={(e) =>
                            updateFAQ(key, 'answer', e.target.value)
                          }
                          placeholder="Provide a clear, helpful answer"
                          rows={3}
                          style={{fontSize: '14px'}}
                        />
                      </Box>
                    </Box>
                  )
                )}
              </>
            )}
          </Card>
        </Box>
      </Flex>

      <Box
        sx={{
          padding: '20px',
          backgroundColor: colors.bgSurface,
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          textAlign: 'center',
          marginTop: '24px',
          width: 'fit-content',
          maxWidth: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <Button
          type="primary"
          size="large"
          icon={<SaveOutlined />}
          loading={saving}
          onClick={handleSave}
          disabled={!businessContext.business_name?.trim()}
          style={{
            height: '40px',
            padding: '0 24px',
            fontSize: '14px',
            fontWeight: 500,
            borderRadius: '8px',
          }}
        >
          Save Business Context
        </Button>
        {!businessContext.business_name?.trim() && (
          <Text
            type="secondary"
            style={{
              fontSize: '12px',
              color: colors.textMuted,
              display: 'block',
              marginTop: '10px',
            }}
          >
            Business name is required to save
          </Text>
        )}
      </Box>
    </Container>
  );
};

export default BusinessContextSettings;
