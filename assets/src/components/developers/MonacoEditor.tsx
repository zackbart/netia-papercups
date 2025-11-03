import React from 'react';
import {Flex} from 'theme-ui';
import Editor, {EditorProps, Monaco} from '@monaco-editor/react';

type Props = {
  onSave?: (code: string) => void;
  onMount?: (editor: any, monaco: Monaco) => void;
  onValidate?: (markers: any[]) => void;
  onChange?: (value: string | undefined) => void;
} & EditorProps;

export const MonacoEditor = (props: Props) => {
  const {onMount, onSave, onValidate, onChange, ...rest} = props;

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    if (onMount) {
      onMount(editor, monaco);
    }

    if (onSave) {
      editor.addAction({
        id: 'save',
        label: 'Save',
        keybindings: [2048 | 49], // [KeyMod.CtrlCmd | KeyCode.KEY_S]
        contextMenuGroupId: 'navigation',
        contextMenuOrder: 1.5,
        run: () => {
          const code = editor.getValue() ?? '';
          onSave(code);
        },
      });
    }

    if (onValidate) {
      const markers = monaco.editor.getModelMarkers({});
      onValidate(markers);
      // Listen for marker changes
      monaco.editor.onDidChangeMarkers(() => {
        const updatedMarkers = monaco.editor.getModelMarkers({});
        onValidate(updatedMarkers);
      });
    }

    if (onChange) {
      editor.onDidChangeModelContent(() => {
        const value = editor.getValue();
        onChange(value);
      });
    }
  };

  // TypeScript doesn't recognize onMount in EditorProps type, but it exists at runtime
  // Cast to any to bypass type checking - the @monaco-editor/react types may be incomplete
  return (
    <Editor
      {...(rest as any)}
      height="100%"
      theme="vs-dark"
      onMount={handleEditorDidMount as any}
      loading={
        <Flex
          sx={{
            bg: '#1e1e1e',
            flex: 1,
            height: '100%',
            width: '100%',
          }}
        ></Flex>
      }
    />
  );
};

export default MonacoEditor;
