defmodule ChatApiWeb.WidgetController do
  use ChatApiWeb, :controller

  def chat(conn, _params) do
    html(conn, chat_html())
  end

  defp chat_html do
    """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Chat Widget</title>
        <script src="https://cdn.jsdelivr.net/npm/phoenix@1.5.3/priv/static/phoenix.min.js"></script>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                background: #fff;
                height: 100vh;
                overflow: hidden;
            }
            
            /* Mobile responsiveness */
            @media (max-width: 480px) {
                #message-input {
                    font-size: 16px !important; /* Prevents zoom on iOS */
                }
                button {
                    min-height: 44px; /* Touch-friendly size */
                    min-width: 60px;
                }
            }
        </style>
    </head>
    <body>
        <div id="chat-widget-root"></div>
        <script>
            const params = new URLSearchParams(window.location.search);
            const config = {
                token: params.get('token') || params.get('accountId'),
                inbox: params.get('inbox'),
                baseUrl: params.get('baseUrl') || window.location.origin,
                title: decodeURIComponent(params.get('title') || 'Chat'),
                subtitle: decodeURIComponent(params.get('subtitle') || ''),
                primaryColor: params.get('primaryColor') || '#1890ff',
                greeting: decodeURIComponent(params.get('greeting') || ''),
                newMessagePlaceholder: decodeURIComponent(params.get('newMessagePlaceholder') || 'Type your message...'),
                agentAvailableText: decodeURIComponent(params.get('agentAvailableText') || ''),
                agentUnavailableText: decodeURIComponent(params.get('agentUnavailableText') || ''),
                showAgentAvailability: params.get('showAgentAvailability') === '1',
                requireEmailUpfront: params.get('requireEmailUpfront') === '1',
                isBrandingHidden: params.get('isBrandingHidden') === 'true',
                companyName: params.get('companyName') || '',
                metadata: params.get('metadata') || '{}',
                customerId: null,
                conversationId: null
            };

            const rootEl = document.getElementById('chat-widget-root');
            rootEl.innerHTML = 
                '<div style="padding: 20px; height: 100vh; display: flex; flex-direction: column;">' +
                    '<div style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">' +
                        '<h2 style="color: ' + config.primaryColor + '; margin: 0;">' + config.title + '</h2>' +
                        '<p style="color: #666; font-size: 14px; margin: 5px 0 0 0;">' + config.subtitle + '</p>' +
                    '</div>' +
                    '<div id="messages" style="flex: 1; overflow-y: auto; padding: 10px 0;"></div>' +
                    '<div style="display: flex; gap: 10px; padding-top: 10px; border-top: 1px solid #eee;">' +
                        '<input type="text" id="message-input" placeholder="' + config.newMessagePlaceholder + '" ' +
                            'style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;" />' +
                        '<button id="send-btn" ' +
                            'style="padding: 10px 20px; background: ' + config.primaryColor + '; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">' +
                            'Send' +
                        '</button>' +
                    '</div>' +
                '</div>';

            const messagesEl = document.getElementById('messages');
            const inputEl = document.getElementById('message-input');
            const sendBtn = document.getElementById('send-btn');

            function addMessage(text, isCustomer) {
                const msgDiv = document.createElement('div');
                msgDiv.style.cssText = 'margin: 10px 0; padding: 10px; border-radius: 8px; max-width: 80%;' +
                    (isCustomer ? 
                        'background: ' + config.primaryColor + '; color: white; margin-left: auto;' : 
                        'background: #f0f0f0; color: #333; margin-right: auto;');
                msgDiv.textContent = text;
                messagesEl.appendChild(msgDiv);
                
                // Smooth scroll to bottom
                setTimeout(function() {
                    messagesEl.scrollTo({
                        top: messagesEl.scrollHeight,
                        behavior: 'smooth'
                    });
                }, 100);
            }

            async function sendMessage() {
                const text = inputEl.value.trim();
                if (!text) return;
                addMessage(text, true);
                inputEl.value = '';

                try {
                    // Create customer if needed
                    if (!config.customerId) {
                        const customerResp = await fetch(config.baseUrl + '/api/customers', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ customer: { account_id: config.token, inbox_id: config.inbox } })
                        });
                        const customerData = await customerResp.json();
                        config.customerId = customerData.data.id;
                    }

                    // Create conversation with first message, or send via WebSocket
                    if (!config.conversationId) {
                        const convResp = await fetch(config.baseUrl + '/api/conversations', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                conversation: { account_id: config.token, inbox_id: config.inbox, customer_id: config.customerId, status: 'open' },
                                message: { body: text, sent_at: new Date().toISOString() }
                            })
                        });
                        const convData = await convResp.json();
                        config.conversationId = convData.data.id;
                        connectToConversation(config.conversationId);
                    } else {
                        // Send subsequent messages via WebSocket channel
                        if (channel) {
                            channel.push('shout', {
                                body: text,
                                customer_id: config.customerId,
                                sent_at: new Date().toISOString()
                            });
                        }
                    }
                } catch (error) {
                    console.error('Error:', error);
                    addMessage('Sorry, there was an error. Please try again.');
                }
            }

            let socket = null;
            let channel = null;

            function connectToConversation(conversationId) {
                if (channel) return;
                socket = new Phoenix.Socket('/socket', {params: {}});
                socket.onOpen(() => console.log('Socket connected'));
                socket.connect();

                channel = socket.channel('conversation:' + conversationId, { customer_id: config.customerId });
                channel.on('shout', (payload) => {
                    if (!payload.user_id && payload.body && payload.type === 'bot') {
                        addMessage(payload.body);
                    }
                });
                channel.join();
            }

            sendBtn.addEventListener('click', sendMessage);
            inputEl.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

            if (config.greeting) addMessage(config.greeting);
            if (config.showAgentAvailability) {
                const statusDiv = document.createElement('div');
                statusDiv.style.cssText = 'text-align: center; padding: 10px; color: #666; font-size: 12px;';
                statusDiv.innerHTML = '<span style="color: #52c41a;">●</span> ' + (config.agentAvailableText || "We're online!");
                messagesEl.insertBefore(statusDiv, messagesEl.firstChild);
            }
            if (!config.isBrandingHidden) {
                const brandDiv = document.createElement('div');
                brandDiv.style.cssText = 'text-align: center; padding: 10px; margin-top: 10px; border-top: 1px solid #eee;';
                brandDiv.innerHTML = '<a href="https://netia.ai" target="_blank" style="color: #999; font-size: 11px; text-decoration: none;">Powered by ' + (config.companyName || 'Netia') + '</a>';
                document.body.appendChild(brandDiv);
            }
        </script>
    </body>
    </html>
    """
  end
end
