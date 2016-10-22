import React from 'react';

export default
class ChatHistory extends React.Component {

  constructor() {
    super();
    this.state = { msgs: [] };
  }

  shouldComponentUpdate(nextProps) 

  /*
  Use shouldComponentUpdate() to let React know if a component's output is not
  affected by the current change in state or props. The default behavior is to
  re-render on every state change, and in the vast majority of cases you should
  rely on the default behavior.
  shouldComponentUpdate() is invoked before rendering when new props or state
  are being received. Defaults to true This method is not called for the initial
  render or when forceUpdate() is used.
  Returning false does not prevent child components from re-rendering when their
  state changes.
  Currently, if shouldComponentUpdate() returns false, then componentWillUpdate(),
  render(), and componentDidUpdate() will not be invoked. Note that in the future
  React may treat shouldComponentUpdate() as a hint rather than a strict directive,
  and returning false may still result in a re-rendering of the component.
  If you determine a specific component is slow after profiling, you may change
  it to inherit from React.PureComponent which implements shouldComponentUpdate()
  with a shallow prop and state comparison. If you are confident you want to
  write it by hand, you may compare this.props with nextProps and this.state with
  nextState and return false to tell React the update can be skipped.

  shouldComponentUpdate	-	должен	ли	компонент	обновиться?	На	самом	деле,
обычно	реакт	сам	отлично	разбирается.	Но	иногда	ручное	управление	позволяет
существенно	ускорить	работу	в	"узких	местах".	С	этим	методом	нужно	работать
очень	аккуратно.

boolean shouldComponentUpdate(object nextProps, object nextState)
Вызывается перед рендерингом при получени новых свойств или состояния.
Этот метод не вызывается для начального рендеринга или когда используется
forceUpdate.
Используйте это как возможность return false, когда вы уверены, что переход на
новые свойства и состояние не потребует обновления компонента.
  */

  {
    const next = nextProps.messages; //asuma, vor np-i msgs-y anvanvum a next
    const current = this.props.messages; // =t.p-i msgs-y anvanum  a current
    return next[next.length - 1] !== current[current.length - 1]; //aysinqn wth
  }

  componentDidUpdate()
  /*
componentDidUpdate	-	вызывается	сразу	после	render.	Не	вызывается	в	момент
первого	render'а	компонента.
componentDidUpdate(object prevProps, object prevState)
Вызывается сразу после возникновения обновление. Этот метод не вызывается для
ачала рендеринга.
Используйте это как возможность работать с DOM, когда компонент уже обновлен.
  */
  {
    const panel = this.refs.chat_container; //inch a es
    if (panel.lastChild) panel.lastChild.scrollIntoView(); //nmanapes
  }

  render() {
    const messageList = this.props.messages.map((message, idx) => {
      return (
        <li key={idx} style={this.props.myStyle.list_items}>
          {message}
        </li>
      );
    });
    return (
      <div ref={'chat_container'} style={this.props.myStyle.container}>
        {messageList}
      </div>
    );
  }
}
