import React from 'react';
import ReactDOM from 'react-dom';
import MsgInput from './MsgInput';
import StatusBar from './StatusBar';
import ChatHistory from './chathistory';
import { webSocketAddr } from './globals';
import { mainContainer,statusBarStyle,chatHistoryStyle,MsgInputStyle } from './styles';
class ChatApp extends React.Component {

  constructor() {

    /*constructor(props)

The constructor for a React component is called before it is mounted.
When implementing the constructor for a React.Component subclass, you should
call super(props) before any other statement. Otherwise, this.props will be
undefined in the constructor, which can lead to bugs.
The constructor is the right place to initialize state. If you don't initialize
state and you don't bind methods, you don't need to implement a constructor for
your React component.*/

    super();
    this.state = { msgs: [], usersNumber: 0 };
    this.conn = new WebSocket(webSocketAddr);
  }

  componentDidMount() {

    /*компонент	примонтировался.	В	данный	момент	у	нас	есть
возможность	использовать	refs,	а	следовательно	это	то	самое	место,	где	мы
хотели	бы	указать	установку	фокуса.	Так	же,	таймауты,	ajax-запросы	и
взаимодействие	с	другими	библиотеками	стоит	обрабатывать	здесь.*/

/*componentDidMount() is invoked immediately after a component is mounted.
Initialization that requires DOM nodes should go here. If you need to load
data from a remote endpoint, this is a good place to instantiate the network
request. Setting state in this method will trigger a re-rendering.*/

/*Вызывается один раз, только на клиенте (не на сервере), сразу же после того,
как происходит инициализация рендеринга. На данном этапе в жизненном цикле
компонент имеет представление DOM, к которому вы можете получить доступ с
помощью this.getDOMNode().
Если вы хотите интегрироваться с другими фреймворками JavaScript, установите
таймеры используя setTimeout или setInterval, или отправьте AJAX запросы,
выполняйте эти операции в этом методе.*/


    this.conn.onmessage = (message) => {
/*
The onmessage event occurs when a message is received through an event source.
The event object for the onmessage event supports the following properties:

  data - Contains the actual message
  origin - The URL of the document that invoked the event
  lastEventId - the identifier of the last message seen in the event stream
*/
      const reply = JSON.parse(message.data);
      //JSON.parse() -  Разбирает строку JSON, возможно с преобразованием
      //получаемого значения и его свойств и возвращает разобранное значение.
      //JSON.parse(text[, reviver])
      //text - Разбираемая строка JSON.
      //reviver -Необязательный-  Если параметр является функцией, определяет
      //преобразование полученного в процессе разбора значения, прежде, чем оно
      //будет возвращено вызывающей стороне.
      //JSON.parse Возвращает объект Object, соответствующий переданной строке JSON text.
      //Выбрасывает исключение SyntaxError, если разбираемая строка не является правильным JSON.
      //Если определён параметр reviver, значение, вычисляемое при разборе строки, будет
        /*преобразовано перед его возвратом. В частности, вычисленное значение и все его свойства
    (начиная с самых вложенных свойств и кончая самим значением), каждое проходят через
    функцию reviver, которая вызывается с контекстом this, содержащим объект в виде
    обрабатываемого свойства, и с аргументами: именем свойства в виде строки и
    значением свойства. Если функция reviver вернёт undefined (либо вообще не вернёт
    никакого значения, например, если выполнение достигнет конца функции), свойство
    будет удалено из объекта. В противном случае свойство будет переопределено
    возвращаемым значением.
    В конечном итоге, функция reviver вызывается с пустой строкой и самым верхним значением,
    чтобы обеспечить преобразование самого верхнего значения. Убедитесь, что вы правильно
    обрабатываете этот случай — обычно для этого нужно просто вернуть само значение —
    ли метод JSON.parse() вернёт undefined. */
      switch (reply.message_type) {
        case 'user_count':
          this.setState({ usersNumber: reply.users_count });
          break;
        case 'initial_message_load':
          this.setState({ msgs: reply.payload });
          break;
        case 'new_chat_message':
          this.setState({ msgs: [...this.state.msgs, reply.payload] });
          break;
        default:
          console.error('Unknown message reply type from server');
      }
    };

    const initialMessageSendTimer = setInterval(() => {
      if (this.conn.readyState === 1) { // stugum enq, vor sockety patrast ini
        this.conn.send(JSON.stringify({
/*Метод JSON.stringify() преобразует значение JavaScript в строку JSON, возможно
с заменой значений, если указана функция замены, или с включением только
определённых свойств, если указан массив замены.
JSON.stringify(value[, replacer[, space]])
value - Значение, преобразуемое в строку JSON
*/
          cmd: 'connect', //wt
        }));
        clearInterval(initialMessageSendTimer); //wt
      }
    }, 500);

    setInterval(() => {
      if (this.conn.readyState === 1) {
        this.conn.send(JSON.stringify({
          cmd: 'user_count', //wt
        }));
      }
    }, 10 * 1000);
  }

  render() {
    return (
        <div style={mainContainer}>
          <StatusBar
            myStyle={statusBarStyle}
            users={this.state.usersNumber}
          />
          <ChatHistory
            myStyle={chatHistoryStyle}
            messages={this.state.msgs}
          />
          <MsgInput
            myStyle={MsgInputStyle}

            {/*wt*/}
            sendMessage={(msg, rawMsg) => this.conn.send(JSON.stringify({

              cmd: 'new_message',
              payload: msg,
              rawMessage:rawMsg,
              {/*wt*/}
            }))}
          />
        </div>
    );
  }
}

ReactDOM.render(<ChatApp />, document.getElementById('react-container'));
