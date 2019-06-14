export default test => {
  return it('Petitions clerk selects first petition on My Document QC', async () => {
    const workItem = test
      .getState('workQueue')
      .find(workItem => workItem.docketNumber === test.docketNumber);

    const documentId = workItem.documentId;
    const messageId = workItem.messages[0].messageId;

    test.documentId = documentId;
    test.messageId = messageId;

    await test.runSequence('gotoDocumentDetailMessageSequence', {
      docketNumber: test.docketNumber,
      documentId,
      messageId,
    });

    expect(test.getState('currentPage')).toEqual('DocumentDetail');
  });
};
