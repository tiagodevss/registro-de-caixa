import { useState } from 'react';
import { Switch, TextInput, View } from 'react-native';
import ModalSelector from 'react-native-modal-selector'
import { Global } from '../../GlobalStyles';

export default function IosDataPicker(props) {

  const [textInputValue, setTextInputValue] = useState(props?.data[0]?.label)
  const data = props.data;

  return (
    <ModalSelector
      data={data}
      initValue={textInputValue}
      accessible={true}
      scrollViewAccessibilityLabel={'Scrollable options'}
      cancelButtonAccessibilityLabel={'Cancel Button'}
      onChange={(option) => {
        props.onValueChange(option.value)
        setTextInputValue(option.label)
      }}>

      <TextInput
        style={Global.textInput}
        editable={false}
        value={textInputValue} />

    </ModalSelector>
  );
}