# LLM Cost Analysis for Netia AI Chat Widget

## Model Comparison (as of Oct 2024)

| Model | Input Cost | Output Cost | Total per 1K msgs* | Speed | Quality |
|-------|-----------|-------------|-------------------|-------|---------|
| **GPT-4o-mini** | $0.15/1M tokens | $0.60/1M tokens | **$0.38** | Fast | Excellent |
| GPT-3.5-turbo | $0.50/1M tokens | $1.50/1M tokens | $1.00 | Fast | Good |
| GPT-4o | $2.50/1M tokens | $10.00/1M tokens | $6.25 | Medium | Best |
| GPT-4-turbo | $10.00/1M tokens | $30.00/1M tokens | $20.00 | Slow | Best |

*Assumes average conversation: 500 input tokens (system prompt + history) + 150 output tokens per response

## Recommendation: GPT-4o-mini ✅

### Why GPT-4o-mini?

1. **Cost Efficiency**: 75% cheaper than GPT-3.5-turbo
   - 1,000 conversations: $0.38 vs $1.00
   - 10,000 conversations: $3.80 vs $10.00
   - 100,000 conversations: $38 vs $100

2. **Better Accuracy**: GPT-4o-mini is based on GPT-4 architecture
   - Better instruction following
   - More context-aware responses
   - Improved reasoning capabilities
   - Better at handling multi-turn conversations

3. **Speed**: Similar latency to GPT-3.5-turbo (~1-2 seconds)

4. **Context Window**: 128K tokens (same as GPT-4o)

### Real-World Cost Examples

**Scenario 1: Small Business (100 chats/month)**
- GPT-4o-mini: $0.04/month
- GPT-3.5-turbo: $0.10/month
- Savings: $0.72/year

**Scenario 2: Medium Business (1,000 chats/month)**
- GPT-4o-mini: $0.38/month
- GPT-3.5-turbo: $1.00/month
- Savings: $7.44/year

**Scenario 3: Enterprise (10,000 chats/month)**
- GPT-4o-mini: $3.80/month
- GPT-3.5-turbo: $10.00/month
- Savings: $74.40/year

**Scenario 4: High Volume (100,000 chats/month)**
- GPT-4o-mini: $38/month
- GPT-3.5-turbo: $100/month
- Savings: $744/year

## Token Usage Breakdown

Typical conversation with 3 customer messages:

```
System Prompt: ~300 tokens
Message 1: ~50 tokens
AI Response 1: ~150 tokens
Message 2: ~50 tokens
AI Response 2: ~150 tokens
Message 3: ~50 tokens
---
Total Input (for 3rd response): ~750 tokens
Total Output: ~150 tokens
```

## Configuration

The model and behavior can be customized via environment variables:

```bash
# Model Selection
LLM_MODEL=gpt-4o-mini  # Default, recommended
# LLM_MODEL=gpt-3.5-turbo  # Legacy
# LLM_MODEL=gpt-4o  # Premium, 16x more expensive

# Response Configuration
LLM_MAX_TOKENS=500  # Max tokens in AI response (default: 500)
LLM_TEMPERATURE=0.7  # Creativity level 0.0-2.0 (default: 0.7)

# Reliability Configuration
LLM_TIMEOUT=30000  # Request timeout in ms (default: 30 seconds)
LLM_MAX_RETRIES=2  # Retry attempts on failure (default: 2)
```

### Timeout & Retry Strategy

To prevent customer-facing errors from API timeouts:

- **30-second timeout**: Allows OpenAI ample time to respond
- **Exponential backoff retries**: Automatically retries on timeout/network errors
  - 1st retry: immediate
  - 2nd retry: after 2 seconds
  - 3rd retry: after 4 seconds
- **Smart retry logic**: Only retries on transient errors (timeouts, 429, 500-504)
- **Fallback message**: If all retries fail, user sees: "I'm having trouble responding right now. Please try again or contact our support team directly."

## Accuracy Improvements in GPT-4o-mini

Based on OpenAI benchmarks, GPT-4o-mini shows:
- **82%** accuracy on MMLU (vs 70% for GPT-3.5-turbo)
- **87%** on HumanEval coding (vs 48% for GPT-3.5-turbo)
- Better at following complex instructions
- More consistent tone and personality
- Better at maintaining context across long conversations

## Conclusion

**GPT-4o-mini is the clear winner** for customer service chatbots:
- ✅ 75% cheaper than GPT-3.5-turbo
- ✅ Significantly more accurate
- ✅ Same speed
- ✅ Better at multi-turn conversations
- ✅ More reliable instruction following

The improved accuracy means fewer confused customers, fewer escalations to human agents, and better customer satisfaction—all while saving money.

