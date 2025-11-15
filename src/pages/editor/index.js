import React from "react";

import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

import Container from "./Container";
import EditorBridge from "./EditorBridge";

import styles from "./index.less";

function BasicLayout(props) {
  return (
    <div className={styles.layout}>
      <DndProvider backend={HTML5Backend}>
        <EditorBridge>
          <Container {...props} />
        </EditorBridge>
      </DndProvider>
    </div>
  );
}

export default BasicLayout;
