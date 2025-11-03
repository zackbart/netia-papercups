import React, {useState, useEffect} from 'react';
import {Button, Card, Alert, Spin, message, Input, Typography} from 'antd';
import {PlusOutlined, DeleteOutlined, SaveOutlined} from '@ant-design/icons';
import {
  fetchBusinessContext,
  createBusinessContext,
  updateBusinessContext,
} from '../../api';
import {BusinessContext} from '../../types';

const {TextArea} = Input;
const {Title, Text} = Typography;

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
      <div style={{textAlign: 'center', padding: '50px'}}>
        <Spin size="large" />
        <div style={{marginTop: '16px'}}>Loading business context...</div>
      </div>
    );
  }

  return (
    <div style={{maxWidth: '800px', margin: '0 auto', padding: '24px'}}>
      <Title level={2}>Business Context</Title>
      <Text type="secondary">
        Configure your business information to help the AI assistant provide
        better responses to your customers.
      </Text>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{marginBottom: '24px'}}
        />
      )}

      <Card style={{marginBottom: '24px'}}>
        <Title level={4}>Basic Information</Title>

        <div style={{marginBottom: '16px'}}>
          <Text strong>Business Name *</Text>
          <Input
            value={businessContext.business_name || ''}
            onChange={(e) => updateField('business_name', e.target.value)}
            placeholder="Enter your business name"
            style={{marginTop: '8px'}}
          />
        </div>

        <div style={{marginBottom: '16px'}}>
          <Text strong>Business Description</Text>
          <TextArea
            value={businessContext.business_description || ''}
            onChange={(e) =>
              updateField('business_description', e.target.value)
            }
            placeholder="Describe your business, what you do, and what makes you unique"
            rows={4}
            style={{marginTop: '8px'}}
          />
        </div>

        <div style={{marginBottom: '16px'}}>
          <Text strong>Scheduling Link</Text>
          <Input
            value={businessContext.scheduling_link || ''}
            onChange={(e) => updateField('scheduling_link', e.target.value)}
            placeholder="https://calendly.com/your-company"
            style={{marginTop: '8px'}}
          />
        </div>
      </Card>

      <Card style={{marginBottom: '24px'}}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <Title level={4} style={{margin: 0}}>
            Services
          </Title>
          <Button type="dashed" icon={<PlusOutlined />} onClick={addService}>
            Add Service
          </Button>
        </div>

        {Object.entries(businessContext.services || {}).map(
          ([key, service], index) => (
            <Card key={key} size="small" style={{marginBottom: '12px'}}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <Text strong>Service {index + 1}</Text>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeService(key)}
                />
              </div>

              <div style={{marginBottom: '12px'}}>
                <Input
                  value={service.name}
                  onChange={(e) => updateService(key, 'name', e.target.value)}
                  placeholder="Service name"
                />
              </div>

              <div style={{marginBottom: '12px'}}>
                <TextArea
                  value={service.description}
                  onChange={(e) =>
                    updateService(key, 'description', e.target.value)
                  }
                  placeholder="Service description"
                  rows={2}
                />
              </div>

              <div>
                <Input
                  value={service.price || ''}
                  onChange={(e) => updateService(key, 'price', e.target.value)}
                  placeholder="Price (e.g., $100/hour, $50 per session)"
                />
              </div>
            </Card>
          )
        )}
      </Card>

      <Card style={{marginBottom: '24px'}}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <Title level={4} style={{margin: 0}}>
            Frequently Asked Questions
          </Title>
          <Button type="dashed" icon={<PlusOutlined />} onClick={addFAQ}>
            Add FAQ
          </Button>
        </div>

        {Object.entries(businessContext.faqs || {}).map(([key, faq], index) => (
          <Card key={key} size="small" style={{marginBottom: '12px'}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <Text strong>FAQ {index + 1}</Text>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeFAQ(key)}
              />
            </div>

            <div style={{marginBottom: '12px'}}>
              <Input
                value={faq.question}
                onChange={(e) => updateFAQ(key, 'question', e.target.value)}
                placeholder="Question"
              />
            </div>

            <div>
              <TextArea
                value={faq.answer}
                onChange={(e) => updateFAQ(key, 'answer', e.target.value)}
                placeholder="Answer"
                rows={3}
              />
            </div>
          </Card>
        ))}
      </Card>

      <Card style={{marginBottom: '24px'}}>
        <Title level={4}>Additional Context</Title>
        <TextArea
          value={businessContext.additional_context || ''}
          onChange={(e) => updateField('additional_context', e.target.value)}
          placeholder="Any additional information about your business, policies, or procedures that would help the AI assistant provide better responses"
          rows={6}
        />
      </Card>

      <div style={{textAlign: 'center'}}>
        <Button
          type="primary"
          size="large"
          icon={<SaveOutlined />}
          loading={saving}
          onClick={handleSave}
          disabled={!businessContext.business_name?.trim()}
        >
          Save Business Context
        </Button>
      </div>
    </div>
  );
};

export default BusinessContextSettings;
