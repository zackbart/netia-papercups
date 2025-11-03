import React from 'react';
import {useSearchParams} from 'react-router-dom';

import {Card, Tabs} from '../common';
import CustomerDetailsConversations from './CustomerDetailsConversations';
import CustomerDetailsNotes from './CustomerDetailsNotes';
import CustomerDetailsIssues from './CustomerDetailsIssues';

const {TabPane} = Tabs;

enum TabKey {
  Conversations = 'Conversations',
  Notes = 'Notes',
  Issues = 'Issues',
}

const getDefaultTab = (searchParams: URLSearchParams): TabKey => {
  const tab = searchParams.get('tab') || 'conversations';

  switch (tab) {
    case 'notes':
      return TabKey.Notes;
    case 'issues':
      return TabKey.Issues;
    case 'conversations':
    default:
      return TabKey.Conversations;
  }
};

type Props = {customerId: string};

const CustomerDetailsMainSection = ({customerId}: Props) => {
  const [searchParams] = useSearchParams();
  const defaultActiveKey = getDefaultTab(searchParams);

  return (
    <Card>
      <Tabs
        defaultActiveKey={defaultActiveKey}
        tabBarStyle={{paddingLeft: '16px', marginBottom: '0'}}
      >
        <TabPane tab={TabKey.Conversations} key={TabKey.Conversations}>
          <CustomerDetailsConversations customerId={customerId} />
        </TabPane>
        <TabPane tab={TabKey.Notes} key={TabKey.Notes}>
          <CustomerDetailsNotes customerId={customerId} />
        </TabPane>
        <TabPane tab={TabKey.Issues} key={TabKey.Issues}>
          <CustomerDetailsIssues customerId={customerId} />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default CustomerDetailsMainSection;
